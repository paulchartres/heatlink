import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {webSocket} from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class HistoryWsService {

  /**
   * Subject used to notify the app of a new history update. No data is received from the WebSocket: this is merely used
   * to tell the application to fetch history data again to stay up to date.
   * @private
   */
  private _historyUpdateBus: Subject<void> = new Subject();

  constructor() { }

  /**
   * Connects to the WebSocket server and subscribes to the 'history' topic. When a message is received, the
   * _historyUpdateBus is notified.
   */
  public connect(): void {
    const ws = webSocket('ws://localhost:3000/ws/history');
    ws.subscribe(() => {
      this._historyUpdateBus.next();
    });
  }

  /**
   * Returns an Observable that emits a void value whenever a new history update is received from the WebSocket.
   */
  public getHistoryUpdateBus(): Observable<void> {
    return this._historyUpdateBus.asObservable();
  }
}
