import {WeekDay} from "../enums/week-day";
import {HeatingMode} from "../enums/heating-mode";
import {SpecialMode} from "../enums/special-mode";

/**+
 * This function converts a numeric value that represents a weekday to its enum counterpart.
 * @param value The numeric value of a weekday.
 */
export function weekDayNumberToEnum(value: number): WeekDay {
    switch (value) {
        case 1:
            return WeekDay.MONDAY;
        case 2:
            return WeekDay.TUESDAY;
        case 3:
            return WeekDay.WEDNESDAY;
        case 4:
            return WeekDay.THURSDAY;
        case 5:
            return WeekDay.FRIDAY;
        case 6:
            return WeekDay.SATURDAY;
        case 7:
            return WeekDay.SUNDAY;
        default:
            return WeekDay.UNKNOWN;
    }
}

/**
 * This function converts the enum value of a weekday to its numeric counterpart.
 * @param weekDay The enum value of a weekday.
 */
export function weekDayEnumToNumber(weekDay: WeekDay): number {
    switch (weekDay) {
        case WeekDay.MONDAY:
            return 1;
        case WeekDay.TUESDAY:
            return 2;
        case WeekDay.WEDNESDAY:
            return 3;
        case WeekDay.THURSDAY:
            return 4;
        case WeekDay.FRIDAY:
            return 5;
        case WeekDay.SATURDAY:
            return 6;
        case WeekDay.SUNDAY:
            return 7;
        default:
            return 0;
    }
}

/**
 * This function converts a heating mode string (received raw from the Heatzy API) to its enum counterpart.
 * @param value The raw Heatzy string of the heating mode.
 */
export function modeStringToEnum(value: string): HeatingMode {
    switch (value) {
        case 'stop':
            return HeatingMode.OFF;
        case 'cft':
            return HeatingMode.COMFORT;
        case 'cft1':
            return HeatingMode.COMFORT_1;
        case 'cft2':
            return HeatingMode.COMFORT_2;
        case 'eco':
            return HeatingMode.ECO;
        case 'fro':
            return HeatingMode.FROST_PROTECTION;
        default:
            return HeatingMode.UNKNOWN;
    }
}

/**
 * This function converts the numeric value of a special heating mode to its enum counterpart.
 * For more info: https://docs.google.com/document/d/1f7QQnBIPwcflL5Txm6tGCaatYxsnBbQnWBEoCn7DcqY/edit?tab=t.0#heading=h.p9mcog8ufcc3
 * @param value The numeric value of the special heating mode.
 */
export function specialModeNumberToEnum(value: number): SpecialMode {
    switch (value) {
        case 0:
            return SpecialMode.NONE;
        case 1:
            return SpecialMode.VACANCY;
        case 2:
            return SpecialMode.BOOST;
        case 3:
            return SpecialMode.MOTION_DETECTION;
        default:
            return SpecialMode.UNKNOWN;
    }
}

/**
 * This function converts the enum value of a special heating mode to its numeric counterpart.
 * For more info: https://docs.google.com/document/d/1f7QQnBIPwcflL5Txm6tGCaatYxsnBbQnWBEoCn7DcqY/edit?tab=t.0#heading=h.p9mcog8ufcc3
 * @param mode The enum value of the special heating mode.
 */
export function heatingModeEnumToNumber(mode: HeatingMode): number {
    switch (mode) {
        case HeatingMode.COMFORT:
            return 0;
        case HeatingMode.ECO:
            return 1;
        case HeatingMode.FROST_PROTECTION:
            return 2;
        case HeatingMode.OFF:
            return 3;
        case HeatingMode.COMFORT_1:
            return 4;
        case HeatingMode.COMFORT_2:
            return 5
        case HeatingMode.UNKNOWN:
            return 3;
    }
}