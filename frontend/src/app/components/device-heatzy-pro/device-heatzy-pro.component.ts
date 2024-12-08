import {Component, Input, OnInit} from '@angular/core';
import {HeatingMode} from "../../services/api/models/heating-mode";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {CommonModule} from "@angular/common";
import {NgIcon} from "@ng-icons/core";
import {DeviceStripped} from "../../services/api/models/device-stripped";
import {ModalsService} from "../../services/modals/modals.service";
import {fadeAnimation} from "../../animations/fade-in-out.animation";
import {HeatingScheduleComponent} from "../heating-schedule/heating-schedule.component";
import {HistoryGraphsComponent} from "../history-graphs/history-graphs.component";
import {TemperatureHistory} from "../../services/api/models/temperature-history";
import {HumidityHistory} from "../../services/api/models/humidity-history";
import {ApiService} from "../../services/api/services/api.service";
import {forkJoin} from "rxjs";
import {MinMax} from "../../models/min-max";
import {DateTime, Duration} from "luxon";
import {DeviceInfoStripped} from "../../services/api/models/device-info-stripped";
import {DataService} from "../../services/data/data.service";
import {SpecialMode} from "../../services/api/models/special-mode";
import {SkeletonLoaderComponent} from "../skeleton-loader/skeleton-loader.component";
import {NotificationsService} from "../../services/notifications/notifications.service";
import {DevicesWsService} from "../../services/ws/devices/devices-ws.service";
import {HistoryWsService} from "../../services/ws/history/history-ws.service";

@Component({
  selector: 'app-device-heatzy-pro',
  standalone: true,
  imports: [
    CommonModule,
    ClickOutsideDirective,
    NgIcon,
    HeatingScheduleComponent,
    HistoryGraphsComponent,
    SkeletonLoaderComponent
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
              private _devicesWs: DevicesWsService,
              private _notifications: NotificationsService,
              private _api: ApiService) {}

  ngOnInit() {
    this._requestHistory();
    this._getDeviceData();
    this._data.getRefreshEvent().subscribe(() => this._getDeviceData());
    this._getWsEvents();
  }

  private _getWsEvents(): void {
    this._devicesWs.getDeviceEventBus(this.device.deviceId).subscribe((event) => {
      this.deviceInfo = event.data;
      this.selectedMode = event.data.mode;
    });
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
    if (this.deviceInfo?.specialMode != SpecialMode.None) {
      return;
    }

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
        this.deviceInfo!.specialMode = SpecialMode.Vacancy;
        this.deviceInfo!.specialModeRemainingTime = value;
        this._api.deviceDeviceIdVacancyPost({
          deviceId,
          body: {
            duration: value
          }
        }).subscribe(() => {
          this._notifications._notify({ body: `Vacancy mode has been enabled for ${value} day${value > 1 ? 's' : ''}.`, icon: 'matWorkOutlineOutline', deviceName: this.device.readableName });
        });
      }
    });
  }

  onOpenBoostModal(): void {
    this.contextMenu = false;
    this._modals.onOpenBoostModal({
      deviceId: this.device.deviceId,
      callback: (deviceId, value) => {
        this.deviceInfo!.specialMode = SpecialMode.Boost;
        this.deviceInfo!.specialModeRemainingTime = value;
        this._api.deviceDeviceIdBoostPost({
          deviceId,
          body: {
            duration: value
          }
        }).subscribe(() => {
          this._notifications._notify({ body: `Boost mode has been enabled for ${Duration.fromObject({ minutes: value }).toFormat('hh:mm')}.`, icon: 'matLocalFireDepartmentOutline', deviceName: this.device.readableName });
        });
      }
    });
  }

  onToggleLockMode(): void {
    this.deviceInfo!.isLocked = !this.deviceInfo!.isLocked;
    this.contextMenu = false;
    if (this.deviceInfo!.isLocked) {
      this._api.deviceDeviceIdLockPost({
        deviceId: this.device.deviceId
      }).subscribe(() => {
        this._notifications._notify({ body: `This device's interface is now locked.`, icon: 'matLockOutline', deviceName: this.device.readableName });
      });
    } else {
      this._api.deviceDeviceIdUnlockPost({
        deviceId: this.device.deviceId
      }).subscribe(() => {
        this._notifications._notify({ body: `This device's interface is now unlocked.`, icon: 'matLockOpenOutline', deviceName: this.device.readableName });
      });
    }
  }

  onEnableMotionDetection(): void {
    this.contextMenu = false;
    this.deviceInfo!.specialMode = SpecialMode.MotionDetection;
    this._api.deviceDeviceIdMotionDetectionPost({
      deviceId: this.device.deviceId
    }).subscribe(() => {
      this._notifications._notify({ body: `Motion detection mode has been enabled.`, icon: 'matPersonOutline', deviceName: this.device.readableName });
    });
  }

  onDisableMotionDetection(): void {
    this._modals.onOpenDisableMotionDetectionModal({
      deviceId: this.device.deviceId,
      callback: (deviceId, value) => {
        this.deviceInfo!.specialMode = SpecialMode.None;
        this._api.deviceDeviceIdResetSpecialModePost({
          deviceId
        }).subscribe(() => {
          this._notifications._notify({ body: `Motion detection mode has been disabled.`, icon: 'matPersonOutline', deviceName: this.device.readableName });
        });
      }
    });
  }

  onDisableBoost(): void {
    this._modals.onOpenDisableBoostModal({
      deviceId: this.device.deviceId,
      callback: (deviceId, value) => {
        this.deviceInfo!.specialMode = SpecialMode.None;
        this._api.deviceDeviceIdResetSpecialModePost({
          deviceId
        }).subscribe(() => {
          this._notifications._notify({ body: `Boost mode has been disabled.`, icon: 'matLocalFireDepartmentOutline', deviceName: this.device.readableName });
        });
      }
    });
  }

  onDisableVacancy(): void {
    this._modals.onOpenDisableVacancyModal({
      deviceId: this.device.deviceId,
      callback: (deviceId, value) => {
        this.deviceInfo!.specialMode = SpecialMode.None;
        this._api.deviceDeviceIdResetSpecialModePost({
          deviceId
        }).subscribe(() => {
          this._notifications._notify({ body: `Vacancy mode has been disabled.`, icon: 'matWorkOutlineOutline', deviceName: this.device.readableName });
        });
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

  protected readonly SpecialMode = SpecialMode;
}
