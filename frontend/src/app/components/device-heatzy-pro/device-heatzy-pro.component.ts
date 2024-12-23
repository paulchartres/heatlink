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
import {catchError, forkJoin, of} from "rxjs";
import {MinMax} from "../../models/min-max";
import {DateTime, Duration} from "luxon";
import {DeviceInfoStripped} from "../../services/api/models/device-info-stripped";
import {SpecialMode} from "../../services/api/models/special-mode";
import {SkeletonLoaderComponent} from "../skeleton-loader/skeleton-loader.component";
import {NotificationsService} from "../../services/notifications/notifications.service";
import {DevicesWsService} from "../../services/ws/devices/devices-ws.service";
import {TranslocoDirective, TranslocoService} from "@jsverse/transloco";
import {WeatherHistory} from "../../services/api/models/weather-history";
import {TextInputComponent} from "../text-input/text-input.component";

@Component({
  selector: 'app-device-heatzy-pro',
  standalone: true,
  imports: [
    CommonModule,
    ClickOutsideDirective,
    NgIcon,
    HeatingScheduleComponent,
    HistoryGraphsComponent,
    SkeletonLoaderComponent,
    TranslocoDirective,
    TextInputComponent
  ],
  templateUrl: './device-heatzy-pro.component.html',
  styleUrl: './device-heatzy-pro.component.scss',
  animations: [fadeAnimation]
})
export class DeviceHeatzyProComponent implements OnInit {

  /**
   * Top-level device information provided by the parent component to instantiate this component. It's always set to
   * something, because it requires it to exist.
   */
  @Input({ required: true }) device!: DeviceStripped;

  /**
   * The detailed device information for the provided DeviceStripped object. Retrieved on init.
   */
  deviceInfo?: DeviceInfoStripped;

  /**
   * Currently selected heating mode for this device.
   */
  selectedMode: HeatingMode = HeatingMode.Off;
  /**
   * Whether the context menu (the one next to the heating modes) is open.
   */
  contextMenu: boolean = false;
  /**
   * Whether we're displaying the extra Comfort-1 and Comfort-2 modes.
   */
  extraModes: boolean = false;
  /**
   * Whether the scheduling widget is open for this device.
   */
  schedulingUtility: boolean = false;
  /**
   * Whether the history widget is open for this device.
   */
  history: boolean = false;

  /**
   * This is used to measure the time between two clicks, to determine whether we have double-clicked.
   * Used to detect a double click on the device name, in order to rename it.
   */
  previousClick?: number;
  /**
   * Whether we are currently editing the device's name, thus replacing the name with an input field.
   */
  editingName: boolean = false;

  /**
   * The bounds of the historic data that should be retrieved for the device.
   * I could've put this here in the history widget, but I want it to be retrieved as soon as the device card is
   * instantiated in order to reduce loading times when opening the history widget.
   * Default frame is one day.
   */
  historyBounds: MinMax = {
    min: DateTime.now().minus({ day: 1 }).toSeconds(),
    max: DateTime.now().toSeconds()
  };
  /**
   * The historic temperature data for this device, which is then provided to the history widget.
   */
  temperatureData: TemperatureHistory[] = [];
  /**
   * The historic humidity data for this device, which is then provided to the history widget.
   */
  humidityData: HumidityHistory[] = [];
  /**
   * The historic temperature and humidity data, retrieved if the LATITUDE and LONGITUDE environment variables are set.
   * Those values are provided to the history widget to compare them to Heatzy historic values.
   */
  externalData?: WeatherHistory[];

  constructor(private _modals: ModalsService,
              private _devicesWs: DevicesWsService,
              private _notifications: NotificationsService,
              private _transloco: TranslocoService,
              private _api: ApiService) {}

  /**
   * Initialization function. We start by requesting the history for this device, requesting detailed device data,
   * and subscribing to the devices websocket to get live updates.
   */
  ngOnInit() {
    this._requestHistory();
    this._getDeviceData();
    this._getWsEvents();
  }

  /**
   * Subscribes to the event bus from the devices websocket service. There's an internal pipe in the service to make
   * sure we only get events relative to this current device.
   * When we get an event, we update the locally stored data to reflect the changes.
   * @private
   */
  private _getWsEvents(): void {
    this._devicesWs.getDeviceEventBus(this.device.deviceId).subscribe((event) => {
      this.deviceInfo = event.data;
      this.selectedMode = event.data.mode;
    });
  }

  /**
   * Retrieves detailed data for the current device by providing the deviceId from the device input object.
   * It then stores it in a local deviceInfo variable for display.
   * @private
   */
  private _getDeviceData(): void {
    this._api.deviceDeviceIdGet({
      deviceId: this.device.deviceId
    }).subscribe((deviceInfo) => {
      this.deviceInfo = deviceInfo;

      // Setting default properties
      this.selectedMode = deviceInfo.mode;
    });
  }

  /**
   * Retrieves historic data for the current device through a forkjoin to make sure we have temperature, humidity and
   * optionally external data at the same time.
   * Those values are then stored in their respective variables to be passed to the history widget.
   * @private
   */
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
      }),
      external: this._api.weatherRangePost({
        body: {
          startTimestamp: this.historyBounds.min,
          endTimestamp: this.historyBounds.max,
          deviceId: this.device.deviceId
        }
      }).pipe(catchError(() => of(undefined)))
      /*
       If we get an error, it means we probably don't have the LATITUDE and LONGITUDE env variables set.
       We catch that error and return an undefined value in that case, so that the forkjoin doesn't crash.
       */
    }).subscribe((data) => {
      this.temperatureData = data.temperature;
      this.humidityData = data.humidity;
      this.externalData = data.external;
    });
  }

  /**
   * Called when we get a history interval change request from the history widget.
   * It changes the history bounds and re-requests the history with the new time frame.
   * @param interval The MinMax bounds of the new history interval.
   */
  onHistoryIntervalChange(interval: MinMax): void {
    this.historyBounds = interval;
    this._requestHistory();
  }

  /**
   * Helper function that translates the raw Heatzy product name to its readable counterpart on the page.
   * @param productName The raw Heatzy device product name.
   */
  productNameToReadableName(productName: string): string {
    switch (productName) {
      case 'Pilote_Pro':
        return 'Pilote Pro';
      default:
        return 'Unknown';
    }
  }

  /**
   * Called when a heating mode button is pressed. Optionally opens the extra modes context menu depending on certain
   * conditions.
   * @param heatingMode The heating mode this device should be changed to.
   */
  onSelectHeatingMode(heatingMode: HeatingMode): void {
    // If we have a special mode, then clicking the manual heating mode buttons should do nothing.
    if (this.deviceInfo?.specialMode != SpecialMode.None) {
      return;
    }

    // If we're already in comfort mode, and we click it again, we should open the comfort-1/-2 selection menu.
    if (heatingMode == HeatingMode.Comfort && (this.selectedMode == HeatingMode.Comfort || this.selectedMode == HeatingMode.Comfort1 || this.selectedMode == HeatingMode.Comfort2)) {
      this.extraModes = true;
    }

    /**
     * If the selected heating mode is comfort-1/-2, that means we clicked an element from that context menu.
     * Means we can close it.
     */
    if (heatingMode == HeatingMode.Comfort1 || heatingMode == HeatingMode.Comfort2) {
      this.extraModes = false;
    }

    this.selectedMode = heatingMode;

    // Of course, we're not forgetting to update the actual cloud data with our new heating mode.
    this._api.deviceDeviceIdModePost({
      deviceId: this.device.deviceId,
      body: {
        mode: heatingMode
      }
    }).subscribe(() => {});
  }

  /**
   * Called when the history button is pressed in the context menu. Uses a timeout to make the animations look
   * smoother if the scheduling widget was already open.
   */
  onOpenHistory(): void {

    if (this.schedulingUtility) {
      // If we already had the scheduling utility open, we give it time to disappear (150ms fade out animation).
      setTimeout(() => {
        this.history = true;
      }, 150);
    } else {
      this.history = true;
    }

    this.contextMenu = false;
    this.schedulingUtility = false;
  }

  /**
   * Called when the scheduling utility button is pressed in the context menu. Uses a timeout to make the animations
   * look smoother if the history widget was already open.
   */
  onOpenSchedulingUtility(): void {

    if (this.history) {
      // If we already had the history utility open, we give it time to disappear (150ms fade out animation).
      setTimeout(() => {
        this.schedulingUtility = true;
      }, 150);
    } else {
      this.schedulingUtility = true;
    }

    this.contextMenu = false;
    this.history = false;
  }

  /**
   * Called when the scheduling utility sends a close event (close button pressed).
   */
  onCloseSchedulingUtility(): void {
    this.schedulingUtility = false;
  }

  /**
   * Called when the "+" button is pressed in the heating modes bar.
   */
  onToggleContextMenu(): void {
    this.contextMenu = !this.contextMenu;
  }

  /**
   * Called whenever we need to close the context menu, either through an outside click or an item click.
   */
  onCloseContextMenu(): void {
    this.contextMenu = false;
  }

  /**
   * Called when the target comfort temperature value is clicked.
   * A modal is opened with a callback that'll update the target temperature for the current device once confirmed.
   */
  onOpenComfortTemperatureModal(): void {
    /**
     * Quick note on modals that I will not be copy/pasting on all modal uses:
     * This isn't the best modal implementation I've done, but it works. All modals already exist at the base app level
     * (app.html), and are controlled by a single "modals" service. These modals accept a configuration object like
     * below, allowing us to set the device ID related to the operation, the callback called once the modal's "Confirm"
     * button is pressed, and optionally a default value for the widget in the modal.
     * It works fairly well for a small app like this one.
     */
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

  /**
   * Called when the target eco temperature value is clicked.
   * A modal is opened with a callback that'll update the target temperature for the current device once confirmed.
   */
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

  /**
   * Called when the vacancy item is clicked in the context menu.
   * A modal is opened with a callback that'll turn on vacancy mode for the selected amount of time for the current
   * device once confirmed.
   */
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
          // Once we've confirmed the update, we display a notification so that the user doesn't think there's a bug.
          this._notifications._notify({ body: this._transloco.translate('vacancy-mode-enabled-notification', { duration: value, suffix: value > 1 ? 's' : '' }), icon: 'matWorkOutlineOutline', deviceName: this.device.readableName });
        });
      }
    });
  }

  /**
   * Called when the boost item is clicked in the context menu.
   * A modal is opened with a callback that'll turn on boost mode for the selected amount of time for the current
   * device once confirmed.
   */
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
          this._notifications._notify({ body: this._transloco.translate('boost-mode-enabled-notification', { duration: Duration.fromObject({ minutes: value }).toFormat('hh:mm') }), icon: 'matLocalFireDepartmentOutline', deviceName: this.device.readableName });
        });
      }
    });
  }

  /**
   * Called when the lock/unlock item is clicked in the context menu.
   * There's no modal for this action, as it's not really a big deal and doesn't need further configuration.
   */
  onToggleLockMode(): void {
    this.deviceInfo!.isLocked = !this.deviceInfo!.isLocked;
    this.contextMenu = false;

    // Classic flip-flop, to switch between locked and unlocked status.
    if (this.deviceInfo!.isLocked) {
      this._api.deviceDeviceIdLockPost({
        deviceId: this.device.deviceId
      }).subscribe(() => {
        this._notifications._notify({ body: this._transloco.translate('device-locked-notification'), icon: 'matLockOutline', deviceName: this.device.readableName });
      });
    } else {
      this._api.deviceDeviceIdUnlockPost({
        deviceId: this.device.deviceId
      }).subscribe(() => {
        this._notifications._notify({ body: this._transloco.translate('device-unlocked-notification'), icon: 'matLockOpenOutline', deviceName: this.device.readableName });
      });
    }
  }

  /**
   * Called when the motion detection item is clicked in the context menu.
   * There's no modal for this action, as it's not really a big deal and doesn't need further configuration.
   */
  onEnableMotionDetection(): void {
    this.contextMenu = false;
    this.deviceInfo!.specialMode = SpecialMode.MotionDetection;
    this._api.deviceDeviceIdMotionDetectionPost({
      deviceId: this.device.deviceId
    }).subscribe(() => {
      this._notifications._notify({ body: this._transloco.translate('motion-detection-enabled-notification'), icon: 'matPersonOutline', deviceName: this.device.readableName });
    });
  }

  /**
   * Called when the motion detection label that replaces the "Off" button is clicked.
   * It opens a prompt to ensure the action was voluntary. Once confirmed, motion detection mode is disabled through
   * the modal callback.
   */
  onDisableMotionDetection(): void {
    this._modals.onOpenDisableMotionDetectionModal({
      deviceId: this.device.deviceId,
      callback: (deviceId, value) => {
        this.deviceInfo!.specialMode = SpecialMode.None;
        this._api.deviceDeviceIdResetSpecialModePost({
          deviceId
        }).subscribe(() => {
          this._notifications._notify({ body: this._transloco.translate('motion-detection-disabled-notification'), icon: 'matPersonOutline', deviceName: this.device.readableName });
        });
      }
    });
  }

  /**
   * Called when the boost label that replaces the "Off" button is clicked.
   * It opens a prompt to ensure the action was voluntary. Once confirmed, boost mode is disabled through
   * the modal callback.
   */
  onDisableBoost(): void {
    this._modals.onOpenDisableBoostModal({
      deviceId: this.device.deviceId,
      callback: (deviceId, value) => {
        this.deviceInfo!.specialMode = SpecialMode.None;
        this._api.deviceDeviceIdResetSpecialModePost({
          deviceId
        }).subscribe(() => {
          this._notifications._notify({ body: this._transloco.translate('boost-mode-disabled-notification'), icon: 'matLocalFireDepartmentOutline', deviceName: this.device.readableName });
        });
      }
    });
  }

  /**
   * Called when the vacancy label that replaces the "Off" button is clicked.
   * It opens a prompt to ensure the action was voluntary. Once confirmed, vacancy mode is disabled through
   * the modal callback.
   */
  onDisableVacancy(): void {
    this._modals.onOpenDisableVacancyModal({
      deviceId: this.device.deviceId,
      callback: (deviceId, value) => {
        this.deviceInfo!.specialMode = SpecialMode.None;
        this._api.deviceDeviceIdResetSpecialModePost({
          deviceId
        }).subscribe(() => {
          this._notifications._notify({ body: this._transloco.translate('vacancy-mode-disabled-notification'), icon: 'matWorkOutlineOutline', deviceName: this.device.readableName });
        });
      }
    });
  }

  /**
   * Called when the extra modes (comfort -1/-2) context menu should be closed (through outside click or item click).
   */
  onCloseExtraModes(): void {
    this.extraModes = false;
  }

  /**
   * Called when the history widget sends a close event (close button pressed).
   */
  onCloseHistory(): void {
    this.history = false;
  }

  /**
   * Used to detect a double click on the device name and to enable name editing mode if that is the case.
   */
  onClickDeviceName(): void {
    const now = DateTime.now().toSeconds();
    // Double click interval is <= 0.3 seconds.
    if (this.previousClick && (now - this.previousClick < 0.3)) {
      this.editingName = true;
    }
    this.previousClick = now;
  }

  /**
   * Called when the user presses Enter on the device name update field.
   */
  onSaveDeviceName(): void {
    this.editingName = false;
    this._api.deviceDeviceIdNamePost({
      deviceId: this.device.deviceId,
      body: {
        name: this.device.readableName
      }
    }).subscribe(() => {
      this._notifications._notify({ body: this._transloco.translate('device-name-updated-notification'), icon: 'matCheckOutline', deviceName: this.device.readableName });
    })
  }

  protected readonly HeatingMode = HeatingMode;

  protected readonly SpecialMode = SpecialMode;
}
