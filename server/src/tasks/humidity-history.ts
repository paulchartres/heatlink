import {getDeviceInfo, getDevices} from "../services/heatzy";
import {archiveHumidity} from "../services/database";

export function archiveHumidityHistory() {
    console.log(`[temperature-history]: Archiving humidity history...`);
    getDevices().then((devices) => {
        for (const device of devices) {
            getDeviceInfo(device.did).then((deviceInfo) => {
                archiveHumidity(deviceInfo.attr.cur_humi, device.did).then(() => {
                    console.log(`[temperature-history]: Archived humidity.`);
                });
            });
        }
    });
}