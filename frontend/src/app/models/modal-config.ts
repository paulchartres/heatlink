export interface ModalConfig {
  defaultValue?: number;
  deviceId: string;
  callback: (deviceId: string, value: number) => void;
}
