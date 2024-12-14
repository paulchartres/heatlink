import {HeatingSchedule} from "../services/api/models/heating-schedule";

export interface CopyToDevicesModalConfig {
  deviceId: string;
  callback: (deviceIds: string[]) => void;
}
