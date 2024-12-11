import {HeatingSchedule} from "../services/api/models/heating-schedule";

export interface PresetModalConfig {
  schedule: HeatingSchedule[];
  deviceName: string;
  callback: () => void;
}
