import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {webSocket} from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class HistoryWsService {

  private _historyUpdateBus: Subject<void> = new Subject();

  constructor() { }

  public connect(): void {
    const ws = webSocket('ws://localhost:3000/ws/history');
    ws.subscribe(() => {
      this._historyUpdateBus.next();
    });
  }

  public getHistoryUpdateBus(): Observable<void> {
    return this._historyUpdateBus.asObservable();
  }
}
