import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {webSocket} from "rxjs/webSocket";
import {DeviceWebSocketEvent} from "../../../events/device-websocket-event";
import {filter} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DevicesWsService {

  /**
   * Subject used to distribute device events throughout the app. All events received from the WebSocket are sent in
   * this event bus.
   * @private
   */
  private _deviceEventBus$: Subject<DeviceWebSocketEvent> = new Subject();

  constructor() { }

  /**
   * Connects to the WebSocket server and subscribes to the 'devices' topic. All events received from the WebSocket are
   * sent to the _deviceEventBus$.
   */
  public connect(): void {
    const ws = webSocket('ws://localhost:3000/ws/devices');
    ws.subscribe((message) => {
      this._deviceEventBus$.next(message as DeviceWebSocketEvent);
    });
  }

  /**
   * Returns an Observable that emits all events related to the device with the given deviceId.
   * @param deviceId The id of the device to listen to.
   */
  public getDeviceEventBus(deviceId: string): Observable<DeviceWebSocketEvent> {
    return this._deviceEventBus$.pipe(
      filter((event) => event.deviceId == deviceId)
    );
  }

}
