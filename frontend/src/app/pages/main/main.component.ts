import {Component, OnInit} from '@angular/core';
import {AsyncPipe, DecimalPipe} from "@angular/common";
import {BoostModalComponent} from "../../modals/boost-modal/boost-modal.component";
import {ChoosePresetModalComponent} from "../../modals/choose-preset-modal/choose-preset-modal.component";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {CopyDayScheduleModalComponent} from "../../modals/copy-day-schedule-modal/copy-day-schedule-modal.component";
import {
    CopyScheduleToDevicesModalComponent
} from "../../modals/copy-schedule-to-devices-modal/copy-schedule-to-devices-modal.component";
import {DeviceHeatzyProComponent} from "../../components/device-heatzy-pro/device-heatzy-pro.component";
import {NewPresetModalComponent} from "../../modals/new-preset-modal/new-preset-modal.component";
import {NgIcon} from "@ng-icons/core";
import {NgScrollbar} from "ngx-scrollbar";
import {NotificationComponent} from "../../components/notification/notification.component";
import {PromptModalComponent} from "../../modals/prompt-modal/prompt-modal.component";
import {TemperatureModalComponent} from "../../modals/temperature-modal/temperature-modal.component";
import {TranslocoDirective} from "@jsverse/transloco";
import {VacancyModalComponent} from "../../modals/vacancy-modal/vacancy-modal.component";
import {Weather} from "../../services/api/models/weather";
import {Notification} from "../../models/notification";
import {ApiService} from "../../services/api/services/api.service";
import {NotificationsService} from "../../services/notifications/notifications.service";
import {DevicesWsService} from "../../services/ws/devices/devices-ws.service";
import {WeatherWsService} from "../../services/ws/weather/weather-ws.service";
import {HistoryWsService} from "../../services/ws/history/history-ws.service";
import {LocaleService} from "../../services/locale/locale.service";
import {DataService} from "../../services/data/data.service";
import {ModalsService} from "../../services/modals/modals.service";
import {WmoService} from "../../services/wmo/wmo.service";
import { HeatingMode } from '../../services/api/models';
import { DateTime } from 'luxon';
import {TimeService} from "../../services/time/time.service";
import {WeatherService} from "../../services/weather/weather.service";
import {RouterLink} from "@angular/router";
import {fadeAnimation} from "../../animations/fade-in-out.animation";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    AsyncPipe,
    BoostModalComponent,
    ChoosePresetModalComponent,
    ClickOutsideDirective,
    CopyDayScheduleModalComponent,
    CopyScheduleToDevicesModalComponent,
    DecimalPipe,
    DeviceHeatzyProComponent,
    NewPresetModalComponent,
    NgIcon,
    NgScrollbar,
    NotificationComponent,
    PromptModalComponent,
    TemperatureModalComponent,
    TranslocoDirective,
    VacancyModalComponent,
    RouterLink
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  animations: [fadeAnimation]
})
export class MainComponent implements OnInit {

  /**
   * Contains the list of currently displayed notifications.
   * They get spliced as they disappear (after three seconds by default).
   */
  notifications: Notification[] = [];
  /**
   * Whether the language picker menu is open.
   */
  languagePicker: boolean = false;
  /**
   * Rick counter for the Easter egg.
   * When it reaches 10, the classic song will play and Rick himself will dance on your screen.
   * Never gonna give you up, never gonna let you down...
   */
  rickCounter: number = 0;

  constructor(private _notifications: NotificationsService,
              private _devicesWs: DevicesWsService,
              private _weatherWs: WeatherWsService,
              private _historyWs: HistoryWsService,
              public time: TimeService,
              public locale: LocaleService,
              public data: DataService,
              public modals: ModalsService,
              public weather: WeatherService,
              public wmo: WmoService) {}

  /**
   * Initialization function.
   * It initializes the locale service to fetch the current locale settings from the browser storage, starts the weather
   * service to display the corresponding widget, and starts the time service to have accurate date and time values
   * in the top bar.
   * It also fetches the devices, connects to the WebSocket services, and subscribes to the notification service.
   */
  ngOnInit() {
    this.locale.init();
    this.data.fetchDevices();
    this._devicesWs.connect();
    this._weatherWs.connect();
    this._historyWs.connect();
    this.time.init();
    this.weather.init();
    this._getNotifications();
  }

  /**
   * Subscribes to the notification service to get the notifications and display them in the notifications list.
   * @private
   */
  private _getNotifications(): void {
    this._notifications.getNotificationEvent().subscribe((notification) => {
      this.notifications.push(notification);
    });
  }

  /**
   * Called when the close event of the comfort temperature modal is triggered.
   * Removes the comfort temperature modal from the DOM.
   */
  onCloseComfortTemperatureModal(): void {
    this.modals.onCloseComfortTemperatureModal();
  }

  /**
   * Called when the close event of the eco temperature modal is triggered.
   * Removes the eco temperature modal from the DOM.
   */
  onCloseEcoTemperatureModal(): void {
    this.modals.onCloseEcoTemperatureModal();
  }

  /**
   * Called when the close event of the vacancy modal is triggered.
   * Removes the vacancy modal from the DOM.
   */
  onCloseVacancyModal(): void {
    this.modals.onCloseVacancyModal();
  }

  /**
   * Called when the close event of the boost modal is triggered.
   * Removes the boost modal from the DOM.
   */
  onCloseBoostModal(): void {
    this.modals.onCloseBoostModal();
  }

  /**
   * Called when the close event of the motion detection disable prompt modal is triggered.
   * Removes the motion detection disable prompt modal from the DOM.
   */
  onCloseDisableMotionDetectionModal(): void {
    this.modals.onCloseDisableMotionDetectionModal();
  }

  /**
   * Called when the close event of the preset deletion prompt modal is triggered.
   * Removes the preset deletion prompt modal from the DOM.
   */
  onCloseDeletePresetModal(): void {
    this.modals.onCloseDeletePresetModal();
  }

  /**
   * Called when the close event of the boost disable prompt modal is triggered.
   * Removes the boost disable prompt modal from the DOM.
   */
  onCloseDisableBoostModal(): void {
    this.modals.onCloseDisableBoostModal();
  }

  /**
   * Called when the close event of the vacancy disable prompt modal is triggered.
   * Removes the vacancy disable prompt modal from the DOM.
   */
  onCloseDisableVacancyModal(): void {
    this.modals.onCloseDisableVacancyModal();
  }

  /**
   * Called when the close event of the new preset modal is triggered.
   * Removes the new preset modal from the DOM.
   */
  onCloseNewPresetModal(): void {
    this.modals.onCloseNewPresetModal();
  }

  /**
   * Called when the close event of the load preset modal is triggered.
   * Removes the load preset modal from the DOM.
   */
  onCloseLoadPresetModal(): void {
    this.modals.onCloseLoadPresetModal();
  }

  /**
   * Called when the close event of the copy schedule to days modal is triggered.
   * Removes the copy schedule to days modal from the DOM.
   */
  onCloseCopyDayScheduleModal(): void {
    this.modals.onCloseCopyDayScheduleModal();
  }

  /**
   * Called when the close event of the copy schedule to devices modal is triggered.
   * Removes the copy schedule to devices modal from the DOM.
   */
  onCloseCopyToDevicesModal(): void {
    this.modals.onCloseCopyToDevicesModal();
  }

  /**
   * Called when the close event of a notification is triggered.
   * It splices the notification from the notifications list.
   * This is automatically called when the notification expires.
   * @param notification The notification to close.
   */
  onCloseNotification(notification: Notification): void {
    this.notifications.splice(this.notifications.indexOf(notification), 1);
  }

  /**
   * Called when the language picker label is pressed. Sets the languagePicker value to true.
   */
  onOpenLanguagePicker(): void {
    this.languagePicker = true;
  }

  /**
   * Called when a click outside the language picker menu or a click on a language is detected.
   * Sets the languagePicker value to false.
   */
  onCloseLanguagePicker(): void {
    this.languagePicker = false;
  }

  /**
   * Called when a language is selected from the language picker menu.
   * Sets the selected locale in the locale service, and closes the language picker menu.
   * @param locale The selected locale code (en, fr).
   */
  onSetLocale(locale: string): void {
    this.onCloseLanguagePicker();
    this.locale.setCurrentLocale(locale);
  }

  /**
   * Called when the heart icon is clicked in the footer.
   * It increments the rickCounter by one.
   * If the rickCounter reaches 10, the classic song will play.
   * Never gonna run around and desert you...
   */
  onClickHeart(): void {
    this.rickCounter += 1;
    if (this.rickCounter == 10) {
      new Audio('/audio/never-gonna-give-you-up.mp3').play()
    }
  }

  protected readonly HeatingMode = HeatingMode;
  protected readonly DateTime = DateTime;

}
