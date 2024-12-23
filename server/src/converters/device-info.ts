import {DeviceInfo} from "../models/device-info";
import {DeviceInfoStripped} from "../models/device-info.stripped";
import {convertScheduleToReadable} from "./schedule";
import {modeStringToEnum, specialModeNumberToEnum} from "./enums";

/**
 * This function converts the raw Heatzy device info signature to the custom Heatlink one.
 * @param deviceInfo The raw device info that should be converted.
 */
export function convertHeatzyDeviceInfoToReadable(deviceInfo: DeviceInfo): DeviceInfoStripped {
    return {
        schedule: convertScheduleToReadable(deviceInfo),
        mode: modeStringToEnum(deviceInfo.attrs.mode),
        currentMode: modeStringToEnum(deviceInfo.attrs.cur_mode),
        isHeating: deviceInfo.attrs.Heating_state == 1,
        currentSignal: modeStringToEnum(deviceInfo.attrs.cur_signal),
        isUsingTimer: deviceInfo.attrs.timer_switch == 1,
        specialMode: specialModeNumberToEnum(deviceInfo.attrs.derog_mode),
        specialModeRemainingTime: deviceInfo.attrs.derog_time,
        isWindowDetectionOn: deviceInfo.attrs.window_switch == 1,
        currentTemperature: deviceInfo.attrs.cur_temp / 10,
        comfortTargetTemperature: deviceInfo.attrs.cft_temp / 10,
        ecoTargetTemperature: deviceInfo.attrs.eco_temp / 10,
        currentHumidity: deviceInfo.attrs.cur_humi,
        isLocked: deviceInfo.attrs.lock_switch == 1
    } as DeviceInfoStripped
}