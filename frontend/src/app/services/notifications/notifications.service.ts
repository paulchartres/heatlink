import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Notification} from "../../models/notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private _notificationEvent$: Subject<Notification> = new Subject();

  constructor() { }

  public _notify(notification: Notification): void {
    this._notificationEvent$.next(notification);
  }

  public getNotificationEvent(): Observable<Notification> {
    return this._notificationEvent$.asObservable();
  }

}
