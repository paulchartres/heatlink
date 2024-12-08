import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {webSocket} from "rxjs/webSocket";
import {DeviceWebSocketEvent} from "../../../events/device-websocket-event";
import {filter} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DevicesWsService {

  private _deviceEventBus$: Subject<DeviceWebSocketEvent> = new Subject();

  constructor() { }

  public connect(): void {
    const ws = webSocket('ws://localhost:3000/ws/devices');
    ws.subscribe((message) => {
      this._deviceEventBus$.next(message as DeviceWebSocketEvent);
    });
  }

  public getDeviceEventBus(deviceId: string): Observable<DeviceWebSocketEvent> {
    return this._deviceEventBus$.pipe(
      filter((event) => event.deviceId == deviceId)
    );
  }

}
