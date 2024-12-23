import { Injectable } from '@angular/core';
import {Weather} from "../api/models/weather";
import {BehaviorSubject, Observable} from "rxjs";
import {ApiService} from "../api/services/api.service";
import {WeatherWsService} from "../ws/weather/weather-ws.service";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  /**
   * Behavior subject containing the current weather (or undefined if not available)
   * @private
   */
  private _weather$: BehaviorSubject<Weather | undefined> = new BehaviorSubject<Weather | undefined>(undefined);
  /**
   * Flag indicating whether the service has been initialized
   * @private
   */
  private _initialized: boolean = false;

  constructor(private _api: ApiService,
              private _weatherWs: WeatherWsService) { }

  /**
   * Initializes the service by fetching the current weather and subscribing to weather events through the WebSocket.
   * If the service has already been initialized, this method does nothing.
   */
  public init(): void {
    if (this._initialized) return;
    this._api.weatherGet().subscribe((weather) => {
      this._weather$.next(weather);
      this._subscribeToWeatherWs();
    });
  }

  /**
   * Subscribes to weather events through the WebSocket. This is used to update the current weather every five minutes,
   * in order to remove the need to refresh the page to see updated weather information.
   * @private
   */
  private _subscribeToWeatherWs(): void {
    this._weatherWs.getWeatherEventBus().subscribe((event) => {
      this._weather$.next(event);
    });
  }

  /**
   * Returns an observable containing the current weather.
   */
  public getWeather(): Observable<Weather | undefined> {
    return this._weather$.asObservable();
  }

}
