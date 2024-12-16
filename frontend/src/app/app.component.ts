import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DeviceStripped} from "./services/api/models/device-stripped";
import {ApiService} from "./services/api/services/api.service";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import {
  matAcUnitOutline,
  matAddOutline,
  matAlarmOutline,
  matBedtimeOutline,
  matCircleOutline,
  matCloudOffOutline, matFavoriteOutline,
  matHideSourceOutline, matHistoryOutline,
  matLocalFireDepartmentOutline,
  matLockOpenOutline,
  matLockOutline,
  matPersonOutline,
  matWbSunnyOutline,
  matWorkOutlineOutline
} from "@ng-icons/material-icons/outline";
import {HeatingMode} from "./services/api/models/heating-mode";
import {CommonModule} from "@angular/common";
import {TemperatureModalComponent} from "./modals/temperature-modal/temperature-modal.component";
import {fadeAnimation} from "./animations/fade-in-out.animation";
import {HeatingSchedule} from "./services/api/models/heating-schedule";
import {WeekDay} from "./services/api/models/week-day";
import {isBetween} from "./helpers/math.helper";
import {Point} from "./models/point.model";
import {VacancyModalComponent} from "./modals/vacancy-modal/vacancy-modal.component";
import {BoostModalComponent} from "./modals/boost-modal/boost-modal.component";
import {ClickOutsideDirective} from "./directives/click-outside.directive";
import {DeviceHeatzyProComponent} from "./components/device-heatzy-pro/device-heatzy-pro.component";
import {ModalsService} from "./services/modals/modals.service";
import {DataService} from "./services/data/data.service";
import {PromptModalComponent} from "./modals/prompt-modal/prompt-modal.component";
import {DateTime} from "luxon";
import {WmoService} from "./services/wmo/wmo.service";
import {Weather} from "./services/api/models/weather";
import {NotificationComponent} from "./components/notification/notification.component";
import {Notification} from "./models/notification";
import {NotificationsService} from "./services/notifications/notifications.service";
import {DevicesWsService} from "./services/ws/devices/devices-ws.service";
import {NgScrollbar} from "ngx-scrollbar";
import {WeatherWsService} from "./services/ws/weather/weather-ws.service";
import {HistoryWsService} from "./services/ws/history/history-ws.service";
import {TranslocoDirective} from "@jsverse/transloco";
import {LocaleService} from "./services/locale/locale.service";
import {NewPresetModalComponent} from "./modals/new-preset-modal/new-preset-modal.component";
import {ChoosePresetModalComponent} from "./modals/choose-preset-modal/choose-preset-modal.component";
import {CopyDayScheduleModalComponent} from "./modals/copy-day-schedule-modal/copy-day-schedule-modal.component";
import {
  CopyScheduleToDevicesModalComponent
} from "./modals/copy-schedule-to-devices-modal/copy-schedule-to-devices-modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NgIconComponent,
    TemperatureModalComponent,
    VacancyModalComponent,
    BoostModalComponent,
    ClickOutsideDirective,
    DeviceHeatzyProComponent,
    PromptModalComponent,
    NotificationComponent,
    NgScrollbar,
    TranslocoDirective,
    NewPresetModalComponent,
    ChoosePresetModalComponent,
    CopyDayScheduleModalComponent,
    CopyScheduleToDevicesModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    provideIcons({
      matWbSunnyOutline,
      matAcUnitOutline,
      matBedtimeOutline,
      matHideSourceOutline,
      matAddOutline,
      matLockOutline,
      matLockOpenOutline,
      matAlarmOutline,
      matPersonOutline,
      matLocalFireDepartmentOutline,
      matWorkOutlineOutline,
      matCloudOffOutline,
      matCircleOutline,
      matHistoryOutline,
      matFavoriteOutline
    })
  ],
  animations: [fadeAnimation]
})
export class AppComponent {


}
