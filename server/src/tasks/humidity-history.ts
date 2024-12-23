import {getDeviceInfo, getDevices} from "../services/heatzy";
import {archiveHumidity} from "../services/database";
import {broadcastHistoryUpdate} from "../websockets/history.websocket";

/**
 * This function is used as a CRON task.
 * It is called at regular intervals to archive each device's current humidity into the database.
 */
export function archiveHumidityHistory() {
    console.log(`[humidity-history]: Archiving humidity history...`);
    getDevices().then((devices) => {
        // We retrieve all the devices and loop on them.
        for (const device of devices) {
            getDeviceInfo(device.did).then((deviceInfo) => {
                // Then, we retrieve the current device's information.
                archiveHumidity(deviceInfo.attrs.cur_humi, device.did).then(() => {
                    /**
                     * Once we have the data, we archive it and notify any connected instances that the history graph
                     * should be updated. That way, no need for a page refresh to see data evolve.
                     */
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