import {getDeviceInfo, getDevices} from "../services/heatzy";
import {archiveTemperature} from "../services/database";
import {broadcastHistoryUpdate} from "../websockets/history.websocket";

/**
 * This function is used as a CRON task.
 * It is called at regular intervals to archive each device's current temperature into the database.
 */
export function archiveTemperatureHistory() {
    console.log(`[temperature-history]: Archiving temperature history...`);
    getDevices().then((devices) => {
        // We retrieve all the devices and loop on them.
        for (const device of devices) {
            getDeviceInfo(device.did).then((deviceInfo) => {
                /**
                 * Then, we retrieve the current device's information.
                 * Note that temperature is expressed in tenths of degrees, which is why we divide it by ten
                 * (to store it directly in readable values in the database)
                 */
                archiveTemperature(deviceInfo.attrs.cur_temp / 10, device.did).then(() => {
                    /**
                     * Once we have the data, we archive it and notify any connected instances that the history graph
                     * should be updated. That way, no need for a page refresh to see data evolve.
                     */
                    console.log(`[temperature-history]: Archived temperature.`);
                    broadcastHistoryUpdate();
                });
            }).catch(() => {
                console.warn(`[temperature-history]: Could not retrieve device info for ${device.did}.`);
            });
        }
    }).catch(() => {
        console.warn(`[temperature-history]: Could not retrieve list of devices.`);
    });
}