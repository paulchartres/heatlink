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
  matCloudOffOutline,
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
    PromptModalComponent
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
      matHistoryOutline
    })
  ],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {

  title = 'heatlink';

  constructor(public data: DataService,
              public modals: ModalsService) {}

  ngOnInit() {
    this.data.fetchDevices();
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

  protected readonly HeatingMode = HeatingMode;
}
