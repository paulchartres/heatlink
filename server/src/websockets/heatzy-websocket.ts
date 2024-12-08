import { WebSocket } from "ws";
import {getAppId, getDevices} from "../services/heatzy";
import {HeatzyWebsocketLoginRequest} from "../models/heatzy-websocket-login-request";
import {getToken} from "../services/authentication";
import {HeatzyWebSocketEvent} from "../events/heatzy-websocket-event";
import {DeviceInfo} from "../models/device-info";
import {broadcastDeviceInfo} from "../app";

const websockets: WebSocket[] = [];

export function connectToWebsockets(): void {
    getDevices().then((devices) => {
        for (const device of devices) {
            const wsUrl: string = `wss://${device.host}:${device.wss_port}/ws/app/v1`;
            const ws = new WebSocket(wsUrl);

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

                setInterval(() => {
                    const heartbeatRequest: HeatzyWebsocketLoginRequest = {
                        cmd: 'ping'
                    };
                    ws.send(JSON.stringify(heartbeatRequest));
                }, 160000);

            });

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