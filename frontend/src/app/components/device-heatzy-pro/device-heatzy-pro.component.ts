import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {HeatingMode} from "../../services/api/models/heating-mode";
import {isBetween} from "../../helpers/math.helper";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {CommonModule, KeyValuePipe} from "@angular/common";
import {NgIcon} from "@ng-icons/core";
import {DeviceStripped} from "../../services/api/models/device-stripped";
import {ModalsService} from "../../services/modals/modals.service";
import {Point} from "../../models/point.model";
import {WeekDay} from "../../services/api/models/week-day";
import {HeatingSchedule} from "../../services/api/models/heating-schedule";
import {fadeAnimation} from "../../animations/fade-in-out.animation";
import {HeatingScheduleComponent} from "../heating-schedule/heating-schedule.component";
import {HistoryGraphsComponent} from "../history-graphs/history-graphs.component";
import {TemperatureHistory} from "../../services/api/models/temperature-history";
import {HumidityHistory} from "../../services/api/models/humidity-history";
import {ApiService} from "../../services/api/services/api.service";
import {forkJoin} from "rxjs";
import {MinMax} from "../../models/min-max";
import {DateTime} from "luxon";
import {DeviceInfoStripped} from "../../services/api/models/device-info-stripped";
import {DataService} from "../../services/data/data.service";

@Component({
  selector: 'app-device-heatzy-pro',
  standalone: true,
  imports: [
    CommonModule,
    ClickOutsideDirective,
    NgIcon,
    HeatingScheduleComponent,
    HistoryGraphsComponent
  ],
  templateUrl: './device-heatzy-pro.component.html',
  styleUrl: './device-heatzy-pro.component.scss',
  animations: [fadeAnimation]
})
export class DeviceHeatzyProComponent implements OnInit {

  @Input({ required: true }) device!: DeviceStripped;

  deviceInfo?: DeviceInfoStripped;

  selectedMode: HeatingMode = HeatingMode.Off;
  contextMenu: boolean = false;
  extraModes: boolean = false;
  schedulingUtility: boolean = false;
  history: boolean = false;

  historyBounds: MinMax = {
    min: DateTime.now().minus({ day: 1 }).toSeconds(),
    max: DateTime.now().toSeconds()
  };
  temperatureData: TemperatureHistory[] = [];
  humidityData: HumidityHistory[] = [];

  constructor(private _modals: ModalsService,
              private _data: DataService,
              private _api: ApiService) {}

  ngOnInit() {
    this._requestHistory();
    this._getDeviceData();
    this._data.getRefreshEvent().subscribe(() => this._getDeviceData());
  }

  private _getDeviceData(): void {
    this._api.deviceDeviceIdGet({
      deviceId: this.device.deviceId
    }).subscribe((deviceInfo) => {
      this.deviceInfo = deviceInfo;

      // Setting default properties
      this.selectedMode = deviceInfo.mode;
    });
  }

  private _requestHistory(): void {
    forkJoin({
      temperature: this._api.deviceDeviceIdHistoryTemperaturePost({
        deviceId: this.device.deviceId,
        body: {
          startTimestamp: this.historyBounds.min,
          endTimestamp: this.historyBounds.max
        }
      }),
      humidity: this._api.deviceDeviceIdHistoryHumidityPost({
        deviceId: this.device.deviceId,
        body: {
          startTimestamp: this.historyBounds.min,
          endTimestamp: this.historyBounds.max
        }
      })
    }).subscribe((data) => {
      this.temperatureData = data.temperature;
      this.humidityData = data.humidity;
    });
  }

  onHistoryIntervalChange(interval: MinMax): void {
    this.historyBounds = interval;
    this._requestHistory();
  }

  productNameToReadableName(productName: string): string {
    switch (productName) {
      case 'Pilote_Pro':
        return 'Pilote Pro';
      default:
        return 'Unknown';
    }
  }

  onSelectHeatingMode(heatingMode: HeatingMode): void {
    if (heatingMode == HeatingMode.Comfort && (this.selectedMode == HeatingMode.Comfort || this.selectedMode == HeatingMode.Comfort1 || this.selectedMode == HeatingMode.Comfort2)) {
      this.extraModes = true;
    }

    if (heatingMode == HeatingMode.Comfort1 || heatingMode == HeatingMode.Comfort2) {
      this.extraModes = false;
    }

    this.selectedMode = heatingMode;

    this._api.deviceDeviceIdModePost({
      deviceId: this.device.deviceId,
      body: {
        mode: heatingMode
      }
    }).subscribe(() => {});
  }

  onOpenHistory(): void {

    if (this.schedulingUtility) {
      setTimeout(() => {
        this.history = true;
      }, 150);
    } else {
      this.history = true;
    }

    this.contextMenu = false;
    this.schedulingUtility = false;
  }

  onOpenSchedulingUtility(): void {

    if (this.history) {
      setTimeout(() => {
        this.schedulingUtility = true;
      }, 150);
    } else {
      this.schedulingUtility = true;
    }

    this.contextMenu = false;
    this.history = false;
  }

  onCloseSchedulingUtility(): void {
    this.schedulingUtility = false;
  }

  onToggleContextMenu(): void {
    this.contextMenu = !this.contextMenu;
  }

  onCloseContextMenu(): void {
    this.contextMenu = false;
  }

  onOpenComfortTemperatureModal(): void {
    this._modals.onOpenComfortTemperatureModal({
      defaultValue: this.deviceInfo!.comfortTargetTemperature,
      deviceId: this.device.deviceId,
      callback: (deviceId, value) => {
        this._api.deviceDeviceIdTargetComfortPost({
          deviceId,
          body: {
            temperature: value
          }
        }).subscribe(() => {
          this.deviceInfo!.comfortTargetTemperature = value;
        });
      }
    });
  }

  onOpenEcoTemperatureModal(): void {
    this._modals.onOpenEcoTemperatureModal({
      defaultValue: this.deviceInfo!.ecoTargetTemperature,
      deviceId: this.device.deviceId,
      callback: (deviceId, value) => {
        this._api.deviceDeviceIdTargetEcoPost({
          deviceId,
          body: {
            temperature: value
          }
        }).subscribe(() => {
          this.deviceInfo!.ecoTargetTemperature = value;
        });
      }
    });
  }

  onOpenVacancyModal(): void {
    this.contextMenu = false;
    this._modals.onOpenVacancyModal({
      deviceId: this.device.deviceId,
      callback: (deviceId, value) => {
        console.log(deviceId, value);
      }
    });
  }

  onOpenBoostModal(): void {
    this.contextMenu = false;
    this._modals.onOpenBoostModal({
      deviceId: this.device.deviceId,
      callback: (deviceId, value) => {
        console.log(deviceId, value);
      }
    });
  }

  onCloseExtraModes(): void {
    this.extraModes = false;
  }

  onCloseHistory(): void {
    this.history = false;
  }

  protected readonly HeatingMode = HeatingMode;

}
