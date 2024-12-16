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
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  notifications: Notification[] = [];
  languagePicker: boolean = false;
  rickCounter: number = 0;

  constructor(private _api: ApiService,
              private _notifications: NotificationsService,
              private _devicesWs: DevicesWsService,
              private _weatherWs: WeatherWsService,
              private _historyWs: HistoryWsService,
              public time: TimeService,
              public locale: LocaleService,
              public data: DataService,
              public modals: ModalsService,
              public weather: WeatherService,
              public wmo: WmoService) {}

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

  private _getNotifications(): void {
    this._notifications.getNotificationEvent().subscribe((notification) => {
      this.notifications.push(notification);
    });
  }

  onCloseComfortTemperatureModal(): void {
    this.modals.onCloseComfortTemperatureModal();
  }

  onCloseEcoTemperatureModal(): void {
    this.modals.onCloseEcoTemperatureModal();
  }

  onCloseVacancyModal(): void {
    this.modals.onCloseVacancyModal();
  }

  onCloseBoostModal(): void {
    this.modals.onCloseBoostModal();
  }

  onCloseDisableMotionDetectionModal(): void {
    this.modals.onCloseDisableMotionDetectionModal();
  }

  onCloseDeletePresetModal(): void {
    this.modals.onCloseDeletePresetModal();
  }

  onCloseDisableBoostModal(): void {
    this.modals.onCloseDisableBoostModal();
  }

  onCloseDisableVacancyModal(): void {
    this.modals.onCloseDisableVacancyModal();
  }

  onCloseNewPresetModal(): void {
    this.modals.onCloseNewPresetModal();
  }

  onCloseLoadPresetModal(): void {
    this.modals.onCloseLoadPresetModal();
  }

  onCloseCopyDayScheduleModal(): void {
    this.modals.onCloseCopyDayScheduleModal();
  }

  onCloseCopyToDevicesModal(): void {
    this.modals.onCloseCopyToDevicesModal();
  }

  onCloseNotification(notification: Notification): void {
    this.notifications.splice(this.notifications.indexOf(notification), 1);
  }

  onOpenLanguagePicker(): void {
    this.languagePicker = true;
  }

  onCloseLanguagePicker(): void {
    this.languagePicker = false;
  }

  onSetLocale(locale: string): void {
    this.onCloseLanguagePicker();
    this.locale.setCurrentLocale(locale);
  }

  onClickHeart(): void {
    this.rickCounter += 1;
    if (this.rickCounter == 10) {
      new Audio('/audio/never-gonna-give-you-up.mp3').play()
    }
  }

  protected readonly HeatingMode = HeatingMode;
  protected readonly DateTime = DateTime;

}
