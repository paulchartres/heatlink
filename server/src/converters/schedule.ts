import {HeatingSchedule} from "../models/heating-schedule";
import {DeviceInfo} from "../models/device-info";
import {HeatingMode} from "../enums/heating-mode";
import {WeekDay} from "../enums/week-day";
import {weekDayEnumToNumber, weekDayNumberToEnum} from "./enums";
import {HeatzySchedule} from "../models/heatzy-schedule";

/**
 * This function outputs a readable schedule from a raw Heatzy device info object.
 * @param deviceInfo The device info that should be converted to a readable schedule.
 */
export function convertScheduleToReadable(deviceInfo: DeviceInfo): HeatingSchedule[] {

    let finalSchedule: HeatingSchedule[] = [];

    // We're going to build our schedule by doing a double loop: the first one is for the weekday, from 1 to 7.
    for (let i = 1; i <= 7; i++) {

        // We create an empty schedule for the current day, with undefined values that will be filled later.
        let schedule: HeatingSchedule = {
            day: weekDayNumberToEnum(i),
            schedule: {
                '00:30': undefined,
                '01:00': undefined,
                '01:30': undefined,
                '02:00': undefined,
                '02:30': undefined,
                '03:00': undefined,
                '03:30': undefined,
                '04:00': undefined,
                '04:30': undefined,
                '05:00': undefined,
                '05:30': undefined,
                '06:00': undefined,
                '06:30': undefined,
                '07:00': undefined,
                '07:30': undefined,
                '08:00': undefined,
                '08:30': undefined,
                '09:00': undefined,
                '09:30': undefined,
                '10:00': undefined,
                '10:30': undefined,
                '11:00': undefined,
                '11:30': undefined,
                '12:00': undefined,
                '12:30': undefined,
                '13:00': undefined,
                '13:30': undefined,
                '14:00': undefined,
                '14:30': undefined,
                '15:00': undefined,
                '15:30': undefined,
                '16:00': undefined,
                '16:30': undefined,
                '17:00': undefined,
                '17:30': undefined,
                '18:00': undefined,
                '18:30': undefined,
                '19:00': undefined,
                '19:30': undefined,
                '20:00': undefined,
                '20:30': undefined,
                '21:00': undefined,
                '21:30': undefined,
                '22:00': undefined,
                '22:30': undefined,
                '23:00': undefined,
                '23:30': undefined
            }
        }

        /**
         * We then do the second loop, from 1 to 12:
         * Each data point (pX_dataY) represents four intervals of thirty minutes. That's 2 hours per data point,
         * so 24 / 2 = 12!
         */
        for (let j = 1; j <= 12; j++) {
            // We create the key that will allow us to retrieve the proper data point from the raw Heatzy device info.
            let key = 'p' + i + '_data' + j;

            // @ts-ignore - Not the cleanest way to do this, but somehow it wouldn't let me use the key here
            // This allows us to retrieve the correct data point with the previously built key.
            const value: number = deviceInfo.attrs[key] as number;
            // We then convert that datapoint (which is decimal) to a binary number.
            const binary: string = Number(value).toString(2).padStart(8, '0');
            // We split the binary into four values: those will be our four thirty minute increments.
            const splitBinary: RegExpMatchArray = binary.match(/.{1,2}/g)!;

            // Necessary because our binary values must be read right to left.
            splitBinary.reverse();

            // One final loop, to read the four binary values.
            for (let k = 0; k < splitBinary.length; k++) {
                let heatingMode: HeatingMode;
                // For more info on this: https://docs.google.com/document/d/1f7QQnBIPwcflL5Txm6tGCaatYxsnBbQnWBEoCn7DcqY/edit?tab=t.0#heading=h.p9mcog8ufcc3
                switch (splitBinary[k]) {
                    case '00':
                        heatingMode = HeatingMode.COMFORT;
                        break;
                    case '01':
                        heatingMode = HeatingMode.ECO;
                        break;
                    case '10':
                        heatingMode = HeatingMode.FROST_PROTECTION;
                        break;
                    default:
                        heatingMode = HeatingMode.UNKNOWN;
                        break;
                }

                /**
                 * This might look complicated, but it's fairly simple.
                 * To get the current hour, we start by getting the datapoint index (remember, two hour increments) and
                 * remove 1 from it so that we're zero based. If we didn't, the values for 00:00 would become 02:00!
                 * We multiply that by two to get the current hour. If we do that though, we'll only work with even
                 * hours, and not with odd hours (0*2 = 0, 1*2 = 2, 2*2 = 4, etc.)
                 * So what we do is we get the current index in the binary values (so from 0 to 3), and we multiply that
                 * by 30 to get the current amount of minutes past the initial hour. So for the third binary value of
                 * the first time frame, it'd be:
                 * 0 * 2 = 0 hours
                 * 2 * 30 = 60 minutes
                 * We then floor that value divided by 60, so that we get the amount of extra hours:
                 * 60 / 60 = 1
                 * So that's 0 hours + 1 hour = 01:00
                 */
                const hours: string = ((j - 1) * 2 + Math.floor(k * 30 / 60)).toString().padStart(2, "0");

                /**
                 * The minutes value is easier. It's basically the same operation as the one above (the minutes part),
                 * but instead of dividing by 60, we get the remainder of the division. Another example, fourth binary
                 * value of the first time frame:
                 * 0 * 2 = 0 hours
                 * 3 * 30 = 90 minutes
                 * 90 % 60 = 30 minutes
                 * That's thirty minutes, so 01:30.
                 */
                const minutes: string = ((k * 30) % 60).toString().padStart(2, "0");

                // We just have to combine our keys, and boom! We get the proper key to write in our schedule.
                const scheduleKey: string = hours + ':' + minutes;

                // @ts-ignore - Just gotta set the schedule's value at the right time to the decoded heating mode.
                schedule.schedule[scheduleKey] = heatingMode;
            }
        }

        // Once we're done with this day, we push it to the final schedule and do the next one.
        finalSchedule.push(schedule);

    }

    return finalSchedule;
}

/**
 * This function converts the Heatlink readable schedule format to the Heatzy one, so that it can be sent to their API.
 * @param readableSchedule The Heatlink readable schedule that should be converted to the Heatzy format.
 */
export function convertReadableScheduleToHeatzyFormat(readableSchedule: HeatingSchedule[]): HeatzySchedule {

    /**
     * Since we'll be reconstituting the schedule, we start with a partial so that we don't have to declare everything
     * as undefined beforehand
     */
    const schedule: Partial<HeatzySchedule> = {};

    for (const day of readableSchedule) {

        /**
         * We start by listing the keys of the current day in the provided readable schedule.
         * They are in chronological order, so we can just loop on them to reconstitute the Heatzy schedule payload.
         */
        const keys = Object.keys(day.schedule);

        // This is to account for the fact that for some reason, the payload sent by the webapp puts '00:00' at the end.
        let lastElement = keys.pop();
        keys.unshift(lastElement!);

        // First, we convert all the values for that day into their binary counterpart.
        // For more info: https://docs.google.com/document/d/1f7QQnBIPwcflL5Txm6tGCaatYxsnBbQnWBEoCn7DcqY/edit?tab=t.0#heading=h.p9mcog8ufcc3
        const binaryValues: string[] = [];
        for (const key of keys) {
            // @ts-ignore - Same issue as always, somehow TS doesn't like accessing objects like that
            switch (day.schedule[key]) {
                case HeatingMode.COMFORT:
                    binaryValues.push('00');
                    break;
                case HeatingMode.ECO:
                    binaryValues.push('01');
                    break;
                case HeatingMode.FROST_PROTECTION:
                    binaryValues.push('10');
                    break;
            }
        }

        const finalValues: number[] = [];
        /**
         * Then, we concatenate those binary values (four by four) and convert them to their decimal counterpart.
         * Note that the binary values must be read right to left. It's the manga of heater scheduling.
         */
        for (let i = 0; i < binaryValues.length; i += 4) {
            const binaryString: string = binaryValues[i + 3] + binaryValues[i + 2] + binaryValues[i + 1] + binaryValues[i];
            finalValues.push(parseInt(binaryString, 2));
        }

        /**
         * But wait, you ask. How can I then send that data to Heatzy? Surely an array won't work?
         * No, it won't. The format is pretty weird, but it's pretty straightforward:
         * pX_dataY -> where X is the index of the weekday (1 based) and Y is the hourly slice (two by two hours)
         * Fore more info on this, check the comments in the convertScheduleToReadable function.
         */
        for (let i = 0; i < finalValues.length; i++) {
            const key: string = `p${weekDayEnumToNumber(day.day)}_data${i + 1}`; // Plus one since it's one based
            // @ts-ignore
            schedule[key] = finalValues[i];
        }
    }

    return schedule as HeatzySchedule;
}