import {HeatingSchedule} from "../models/heating-schedule";
import {DeviceInfo} from "../models/device-info";
import {HeatingMode} from "../enums/heating-mode";
import {WeekDay} from "../enums/week-day";
import {weekDayEnumToNumber, weekDayNumberToEnum} from "./enums";
import {HeatzySchedule} from "../models/heatzy-schedule";

export function convertScheduleToReadable(deviceInfo: DeviceInfo): HeatingSchedule[] {

    let finalSchedule: HeatingSchedule[] = [];

    for (let i = 1; i <= 7; i++) {

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

        for (let j = 1; j <= 12; j++) {
            let key = 'p' + i + '_data' + j;
            // @ts-ignore
            const value: number = deviceInfo.attr[key] as number;
            const binary: string = Number(value).toString(2).padStart(8, '0');
            const splitBinary: RegExpMatchArray = binary.match(/.{1,2}/g)!;

            // Necessary because our binary values must be read right to left.
            splitBinary.reverse();

            for (let k = 0; k < splitBinary.length; k++) {
                let heatingMode: HeatingMode;
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

                const hours: string = ((j - 1) * 2 + Math.floor(k * 30 / 60)).toString().padStart(2, "0");
                const minutes: string = ((k * 30) % 60).toString().padStart(2, "0");
                const scheduleKey: string = hours + ':' + minutes;

                // @ts-ignore
                schedule.schedule[scheduleKey] = heatingMode;
            }
        }

        finalSchedule.push(schedule);

    }

    return finalSchedule;
}

export function convertReadableScheduleToHeatzyFormat(readableSchedule: HeatingSchedule[]): HeatzySchedule {
    const schedule: Partial<HeatzySchedule> = {};
    for (const day of readableSchedule) {

        const keys = Object.keys(day.schedule);

        // This is to account for the fact that for some reason, the payload sent by the webapp puts '00:00' at the end
        let lastElement = keys.pop();
        keys.unshift(lastElement!);

        // First, we convert all the values for that day into their binary counterpart
        const binaryValues: string[] = [];
        for (const key of keys) {
            // @ts-ignore
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
        // Then, we concatenate those binary values (four by four) and convert them to their decimal counterpart.
        // Note that the binary values must be read right to left. It's the manga of heater scheduling.
        for (let i = 0; i < binaryValues.length; i += 4) {
            const binaryString: string = binaryValues[i + 3] + binaryValues[i + 2] + binaryValues[i + 1] + binaryValues[i];
            finalValues.push(parseInt(binaryString, 2));
        }

        // But wait, you ask. How can I then send that data to Heatzy? Surely an array won't work?
        // No, it won't. The format is pretty weird, but it's pretty straightforward:
        // pX_dataY -> where X is the index of the weekday (1 based) and Y is the hourly slice (two by two hours)
        for (let i = 0; i < finalValues.length; i++) {
            const key: string = `p${weekDayEnumToNumber(day.day)}_data${i + 1}`; // Plus one since it's one based
            // @ts-ignore
            schedule[key] = finalValues[i];
        }
    }

    return schedule as HeatzySchedule;
}