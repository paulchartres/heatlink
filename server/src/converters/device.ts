import {Device} from "../models/device";
import {DeviceStripped} from "../models/device.stripped";

/**
 * This function converts the raw Heatzy device signature to the custom Heatlink one.
 * @param device The raw Heatzy device that should be converted.
 */
export function convertHeatzyDeviceToReadable(device: Device): DeviceStripped {
    return {
        deviceId: device.did,
        readableName: device.dev_alias,
        macAddress: device.mac,
        isOnline: device.is_online,
        productName: device.product_name
    }
}