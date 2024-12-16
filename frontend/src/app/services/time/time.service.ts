import { Injectable } from '@angular/core';
import {DateTime} from "luxon";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private _now$: BehaviorSubject<DateTime> = new BehaviorSubject(DateTime.now());
  private _initialized: boolean = false;

  constructor() { }

  public init(): void {
    if (this._initialized) return;
    setInterval(() => {
      this._now$.next(DateTime.now());
    }, 1000);
  }

  public getTime(): Observable<DateTime> {
    return this._now$.asObservable();
  }

}
