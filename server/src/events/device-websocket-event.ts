import {DeviceInfoStripped} from "../models/device-info.stripped";

export interface DeviceWebsocketEvent {
    deviceId: string;
    data: DeviceInfoStripped;
}