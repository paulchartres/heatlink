import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Notification} from "../../models/notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  /**
   * Subject to notify the main app when a new notification should be displayed.
   * @private
   */
  private _notificationEvent$: Subject<Notification> = new Subject();

  constructor() { }

  /**
   * Notifies the main app that a new notification should be displayed.
   * @param notification The notification to display.
   */
  public _notify(notification: Notification): void {
    this._notificationEvent$.next(notification);
  }

  /**
   * Returns an observable that will notify the main app when a new notification should be displayed.
   */
  public getNotificationEvent(): Observable<Notification> {
    return this._notificationEvent$.asObservable();
  }

}
