import {DeviceInfoStripped} from "../services/api/models/device-info-stripped";

export interface DeviceWebSocketEvent {
  deviceId: string;
  data: DeviceInfoStripped;
}
