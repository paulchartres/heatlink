import { Injectable } from '@angular/core';
import {Weather} from "../api/models/weather";
import {BehaviorSubject, Observable} from "rxjs";
import {ApiService} from "../api/services/api.service";
import {WeatherWsService} from "../ws/weather/weather-ws.service";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private _weather$: BehaviorSubject<Weather | undefined> = new BehaviorSubject<Weather | undefined>(undefined);
  private _initialized: boolean = false;

  constructor(private _api: ApiService,
              private _weatherWs: WeatherWsService) { }

  public init(): void {
    if (this._initialized) return;
    this._api.weatherGet().subscribe((weather) => {
      this._weather$.next(weather);
      this._subscribeToWeatherWs();
    });
  }

  private _subscribeToWeatherWs(): void {
    this._weatherWs.getWeatherEventBus().subscribe((event) => {
      this._weather$.next(event);
    });
  }

  public getWeather(): Observable<Weather | undefined> {
    return this._weather$.asObservable();
  }

}
