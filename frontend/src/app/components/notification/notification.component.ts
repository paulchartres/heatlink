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

  /**
   * Notification configuration object. This is retrieved from the @for loop used to instantiate the notification, so
   * it's always set to something.
   */
  @Input({ required: true }) notification!: Notification;

  /**
   * Emitted when the notification's expiration is reached (3 seconds by default).
   */
  @Output() close: EventEmitter<void> = new EventEmitter();

  /**
   * This is a neat little trick I use to lazy-load icons while not depending on the provideIcons provider.
   * We pass the icon name in the notification configuration object, and directly fetch the SVG code from the package.
   * We can then use the svg binding of the ng-icon component to display it.
   */
  iconSvg!: string;
  /**
   * We count the remaining time left until the notification disappears in milliseconds. This is updated with a
   * setInterval later on.
   * @private
   */
  private _remainingTime: number = 3000;
  /**
   * This is a reference to the interval we use to decrease the remaining time of the notification.
   * We use it so that we can clear the interval once the notification dies, to ensure we don't have any memory leaks.
   */
  interval?: any;

  /**
   * Initialization function.
   * We start by loading the SVG code for the icon, and we start the timer to make the notification disappear after
   * three seconds.
   */
  ngOnInit() {
    // @ts-ignore
    this.iconSvg = icons[this.notification.icon];
    this._startTimer();
  }

  /**
   * This function is used to start the timer that makes the notification disappear after three seconds.
   * We store the reference of the interval in a variable to clear it before removing the notification.
   * Every ten milliseconds, the remaining time is updated, in order to make the notification progress bar look smooth.
   * Once the remaining time reaches zero, we emit on the close emitter.
   * @private
   */
  private _startTimer(): void {
    this.interval = setInterval(() => {
      this._remainingTime -= 10;
      if (this._remainingTime <= 0) {
        clearInterval(this.interval);
        this.close.emit();
      }
    }, 10);
  }

  /**
   * This is used to get the progress bar width as a percentage, to display how much time is left before the
   * notification disappears.
   */
  getRemainingTimeBarWidth(): number {
    return this._remainingTime * 100 / 3000;
  }

}
