import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {DeviceStripped} from "../api/models/device-stripped";
import {ApiService} from "../api/services/api.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  /**
   * A BehaviorSubject that holds the devices. It is updated when the devices are fetched.
   * @private
   */
  private _devices$: BehaviorSubject<DeviceStripped[]> = new BehaviorSubject<DeviceStripped[]>([]);

  constructor(private _api: ApiService) { }

  // Fetchers

  /**
   * Fetches the devices from the API and updates the _devices$ BehaviorSubject so that all listening components
   * can display the data live.
   */
  fetchDevices(): void {
    this._api.devicesGet().subscribe((devices) => {
      this._devices$.next(devices);
    });
  }

  // Getters

  /**
   * Returns an Observable that emits the devices as soon as they are fetched.
   */
  getDevices(): Observable<DeviceStripped[]> {
    return this._devices$.asObservable();
  }

}
