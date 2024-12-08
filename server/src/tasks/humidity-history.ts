import {getDeviceInfo, getDevices} from "../services/heatzy";
import {archiveHumidity} from "../services/database";
import {broadcastHistoryUpdate} from "../app";

export function archiveHumidityHistory() {
    console.log(`[humidity-history]: Archiving humidity history...`);
    getDevices().then((devices) => {
        for (const device of devices) {
            getDeviceInfo(device.did).then((deviceInfo) => {
                archiveHumidity(deviceInfo.attrs.cur_humi, device.did).then(() => {
                    console.log(`[humidity-history]: Archived humidity.`);
                    broadcastHistoryUpdate();
                });
            }).catch(() => {
                console.warn(`[humidity-history]: Could not retrieve device info for ${device.did}.`);
            });
        }
    }).catch(() => {
        console.warn(`[humidity-history]: Could not retrieve list of devices.`);
    });
}