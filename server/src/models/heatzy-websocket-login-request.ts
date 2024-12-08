export interface HeatzyWebsocketLoginRequest {
    cmd: string;
    data?: {
        appid: string;
        uid: string;
        token: string;
        p0_type: string;
        heartbeat_interval: number;
        auto_subscribe: boolean;
    }
}