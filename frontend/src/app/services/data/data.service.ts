import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {DeviceStripped} from "../api/models/device-stripped";
import {ApiService} from "../api/services/api.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _devices$: BehaviorSubject<DeviceStripped[]> = new BehaviorSubject<DeviceStripped[]>([]);
  private _refreshData$: Subject<void> = new Subject<void>();

  constructor(private _api: ApiService) { }

  // Fetchers

  fetchDevices(): void {
    this._api.devicesGet().subscribe((devices) => {
      this._devices$.next(devices);
    });
  }

  // Getters

  getDevices(): Observable<DeviceStripped[]> {
    return this._devices$.asObservable();
  }

  getRefreshEvent(): Observable<void> {
    return this._refreshData$.asObservable();
  }

  // Setters

  refresh(): void {
    this._refreshData$.next();
  }

}
