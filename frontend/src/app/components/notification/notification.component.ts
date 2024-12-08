import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgIcon} from "@ng-icons/core";
import * as icons from '@ng-icons/material-icons/outline';
import {CommonModule} from "@angular/common";
import {Notification} from "../../models/notification";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    NgIcon
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {

  @Input({ required: true }) notification!: Notification;

  @Output() close: EventEmitter<void> = new EventEmitter();

  iconSvg!: string;
  private _remainingTime: number = 3000;
  interval?: any;

  ngOnInit() {
    // @ts-ignore
    this.iconSvg = icons[this.notification.icon];
    this._startTimer();
  }

  private _startTimer(): void {
    this.interval = setInterval(() => {
      this._remainingTime -= 10;
      if (this._remainingTime <= 0) {
        clearInterval(this.interval);
        this.close.emit();
      }
    }, 10);
  }

  getRemainingTimeBarWidth(): number {
    return this._remainingTime * 100 / 3000;
  }

  onClose(): void {
    this.close.emit();
  }

}
