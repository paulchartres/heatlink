import {HeatingSchedule} from "../models/heating-schedule";
import {DeviceInfo} from "../models/device-info";
import {HeatingMode} from "../enums/heating-mode";
import {WeekDay} from "../enums/week-day";
import {weekDayNumberToEnum} from "./enums";

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