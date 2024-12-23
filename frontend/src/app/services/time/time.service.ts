import { Injectable } from '@angular/core';
import {DateTime} from "luxon";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  /**
   * Behavior subject containing the current time.
   * @private
   */
  private _now$: BehaviorSubject<DateTime> = new BehaviorSubject(DateTime.now());
  /**
   * Flag indicating whether the service has been initialized.
   * @private
   */
  private _initialized: boolean = false;

  constructor() { }

  /**
   * Initializes the service.
   * It sets up an interval to update the current time every second. If the service has already been initialized,
   * it does nothing.
   */
  public init(): void {
    if (this._initialized) return;
    setInterval(() => {
      this._now$.next(DateTime.now());
    }, 1000);
  }

  /**
   * Returns an observable that emits the current time every second.
   */
  public getTime(): Observable<DateTime> {
    return this._now$.asObservable();
  }

}
