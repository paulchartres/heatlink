import { WebSocket } from "ws";
import {getAppId, getDevices} from "../services/heatzy";
import {HeatzyWebsocketLoginRequest} from "../models/heatzy-websocket-login-request";
import {getToken} from "../services/authentication";
import {HeatzyWebSocketEvent} from "../events/heatzy-websocket-event";
import {DeviceInfo} from "../models/device-info";
import {broadcastDeviceInfo} from "../websockets/devices.websocket";

// This contains the list of websockets for each device linked to the Heatzy account using the app.
const websockets: WebSocket[] = [];

/**
 * This function retrieves all the devices linked to the account using the app.
 * It connects to the Gizwits status websocket for each device, and pipes any event from there into our own local
 * websocket, so that the format is easier to manage.
 */
export function connectToWebsockets(): void {
    // We first retrieve all the devices to loop on them.
    getDevices().then((devices) => {
        for (const device of devices) {
            // Each device has a host and wss_port property that allow us to connect to the proper websocket service.
            const wsUrl: string = `wss://${device.host}:${device.wss_port}/ws/app/v1`;
            const ws = new WebSocket(wsUrl);

            /**
             * Once the websocket is open, we immediately send a login request to it.
             * For more info: https://docs.gizwits.com/en-us/cloud/WebsocketAPI.html
             */
            ws.on('open', () => {
                console.log(`[heatzy-websocket]: Connected to websocket for device ${device.did}.`);

                const loginRequest: HeatzyWebsocketLoginRequest = {
                    cmd: 'login_req',
                    data: {
                        appid: getAppId(),
                        uid: getToken().uid,
                        token: getToken().token,
                        p0_type: 'attrs_v4',
                        auto_subscribe: true,
                        heartbeat_interval: 180
                    }
                }
                ws.send(JSON.stringify(loginRequest));

                /**
                 * As the documentation states, a ping request needs to be sent at a regular interval to the websocket.
                 * We set the heartbeat interval to 180 seconds (see above), so we're sending a ping request every
                 * 160 seconds using an interval.
                 */
                setInterval(() => {
                    const heartbeatRequest: HeatzyWebsocketLoginRequest = {
                        cmd: 'ping'
                    };
                    ws.send(JSON.stringify(heartbeatRequest));
                }, 160000);

            });

            /**
             * When we get a message on the Gizwits websocket, we send it to our deviceInfo websocket.
             * The broadcasts function takes care of the formatting for us, converting raw Heatzy data into our local
             * readable format.
             */
            ws.on('message', (message) => {
                const event: HeatzyWebSocketEvent = JSON.parse(message.toString('utf-8'));
                if (event.cmd == 's2c_noti') {
                    broadcastDeviceInfo(event.data as DeviceInfo, event.data!.did);
                }
            });

            websockets.push(ws);
        }
    });
}