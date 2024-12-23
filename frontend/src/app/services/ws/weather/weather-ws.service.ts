import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Weather} from "../../api/models/weather";
import {webSocket} from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class WeatherWsService {

  /**
   * Subject used to notify the app of a new weather update. Data is received from the WebSocket and emitted to the
   * application for live weather updates.
   * @private
   */
  private _weatherEventBus$: Subject<Weather> = new Subject();

  constructor() { }

  /**
   * Connects to the WebSocket server and subscribes to the 'weather' topic. When a message is received, the
   * _weatherEventBus is notified.
   */
  public connect(): void {
    const ws = webSocket('ws://localhost:3000/ws/weather');
    ws.subscribe((message) => {
      this._weatherEventBus$.next(message as Weather);
    });
  }

  /**
   * Returns an Observable that emits a Weather object whenever a new weather update is received from the WebSocket.
   */
  public getWeatherEventBus(): Observable<Weather> {
    return this._weatherEventBus$.asObservable();
  }

}
