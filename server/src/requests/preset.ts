import {HeatingSchedule} from "../models/heating-schedule";

export interface PresetRequest {
    schedule: HeatingSchedule[];
    name: string;
    description: string;
}