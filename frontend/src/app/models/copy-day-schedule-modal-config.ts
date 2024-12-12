import {HeatingSchedule} from "../services/api/models/heating-schedule";

export interface CopyDayScheduleModalConfig {
  schedule: HeatingSchedule;
  callback: (days: string[]) => void;
}
