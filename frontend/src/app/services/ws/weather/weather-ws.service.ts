import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Weather} from "../../api/models/weather";
import {webSocket} from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class WeatherWsService {

  private _weatherEventBus$: Subject<Weather> = new Subject();

  constructor() { }

  public connect(): void {
    const ws = webSocket('ws://localhost:3000/ws/weather');
    ws.subscribe((message) => {
      this._weatherEventBus$.next(message as Weather);
    });
  }

  public getWeatherEventBus(): Observable<Weather> {
    return this._weatherEventBus$.asObservable();
  }

}
