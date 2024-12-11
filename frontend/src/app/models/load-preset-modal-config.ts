import {Preset} from "../services/api/models/preset";

export interface LoadPresetModalConfig {
  callback: (preset: Preset) => void;
}
