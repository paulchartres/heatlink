import {HeatingMode} from "../enums/heating-mode";
import {HeatingSchedule} from "./heating-schedule";
import {SpecialMode} from "../enums/special-mode";

export interface DeviceInfoStripped {
    schedule: HeatingSchedule[];
    mode: HeatingMode;
    currentMode: HeatingMode;
    isHeating: boolean;
    currentSignal: HeatingMode;
    isUsingTimer: boolean;
    specialMode: SpecialMode;
    specialModeRemainingTime: number;
    isWindowDetectionOn: boolean;
    currentTemperature: number;
    comfortTargetTemperature: number;
    ecoTargetTemperature: number;
    currentHumidity: number;
    isLocked: boolean;
}