import {getDeviceInfo, getDevices} from "../services/heatzy";
import {archiveTemperature} from "../services/database";

export function archiveTemperatureHistory() {
    console.log(`[temperature-history]: Archiving temperature history...`);
    getDevices().then((devices) => {
        for (const device of devices) {
            getDeviceInfo(device.did).then((deviceInfo) => {
                archiveTemperature(deviceInfo.attr.cur_temp / 10, device.did).then(() => {
                    console.log(`[temperature-history]: Archived temperature.`);
                });
            });
        }
    });
}