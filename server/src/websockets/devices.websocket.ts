import {WebSocket} from "ws";
import expressWs from "express-ws";
import {DeviceInfo} from "../models/device-info";
import {DeviceWebsocketEvent} from "../events/device-websocket-event";
import {convertHeatzyDeviceInfoToReadable} from "../converters/device-info";

// This stores all the current connections to the devices websocket.
const devicesWsConnections: WebSocket[] = [];

/**
 * This function sets up the devices websocket on the /ws/devices endpoint.
 * @param app The reference to the Express application to start the websocket on.
 */
export function setupDevicesWebsocket(app: expressWs.Application): void {
    app.ws('/ws/devices', (ws, req) => {
        // When we get a connection, we add it to the devicesWsConnections array.
        devicesWsConnections.push(ws);
        ws.on('close', () => {
            // When someone disconnects, we remove the session from the array.
            devicesWsConnections.splice(devicesWsConnections.indexOf(ws), 1);
        });
    });
}

/**
 * This function broadcasts on the devices websocket (it sends the provided device info to all connected instances).
 * Each event also has a device ID, so that only the right device gets updated in the webapp.
 * @param deviceInfo The device info received from the Gizwits websocket.
 * @param deviceId The ID of the device for which the update was received.
 */
export function broadcastDeviceInfo(deviceInfo: DeviceInfo, deviceId: string): void {
    // We build our event with the device ID and the data received from the Gizwits websocket.
    const event: DeviceWebsocketEvent = {
        deviceId,
        data: convertHeatzyDeviceInfoToReadable(deviceInfo)
    }
    for (const client of devicesWsConnections) {
        client.send(JSON.stringify(event));
    }
}