import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {HeatingMode} from "../../services/api/models/heating-mode";
import {isBetween} from "../../helpers/math.helper";
import {CommonModule} from "@angular/common";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {HeatingSchedule} from "../../services/api/models/heating-schedule";
import {WeekDay} from "../../services/api/models/week-day";
import {Point} from "../../models/point.model";
import {fadeAnimation} from "../../animations/fade-in-out.animation";
import {ApiService} from "../../services/api/services/api.service";
import {DateTime, Info} from "luxon";
import {NotificationsService} from "../../services/notifications/notifications.service";
import {ButtonComponent} from "../button/button.component";
import {TranslocoDirective, TranslocoService} from "@jsverse/transloco";
import {
  matContentCopyOutline,
  matFileUploadOutline,
  matMoreHorizOutline,
  matSaveOutline
} from "@ng-icons/material-icons/outline";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {ModalsService} from "../../services/modals/modals.service";
import {forkJoin, Observable} from "rxjs";

@Component({
  selector: 'app-heating-schedule',
  standalone: true,
  imports: [
    CommonModule,
    NgIcon,
    ButtonComponent,
    TranslocoDirective,
    ClickOutsideDirective
  ],
  providers: [
    provideIcons({
      matMoreHorizOutline,
      matSaveOutline,
      matFileUploadOutline,
      matContentCopyOutline
    })
  ],
  templateUrl: './heating-schedule.component.html',
  styleUrl: './heating-schedule.component.scss',
  animations: [fadeAnimation]
})
export class HeatingScheduleComponent implements OnInit, OnChanges {

  /**
   * Reference to the schedule DOM wrapper, in general to get size info for transforms with modals and whatnot.
   */
  @ViewChild('scheduleWrapper') scheduleWrapper!: ElementRef<HTMLDivElement>;

  /**
   * Readable device schedule provided from the parent component.
   */
  @Input({ required: true }) deviceSchedule!: HeatingSchedule[];
  /**
   * Device ID for the device whose schedule is edited in this widget.
   */
  @Input({ required: true }) deviceId!: string;
  /**
   * Device name for the device whose schedule is edited in this widget.
   */
  @Input({ required: true }) deviceName!: string;
  /**
   * Whether the device is currently using timer mode.
   */
  @Input({ required: true }) scheduleMode!: boolean;

  /**
   * Emitted when the close button is pressed to let the parent component remove the widget.
   */
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Whether the schedule update is loading. Used to avoid pressing the button several times.
   */
  loading: boolean = false;
  /**
   * Whether the schedule context menu is open. This is for the one next to the widget title.
   */
  contextMenu: boolean = false;
  /**
   * Day for which the day context menu is open. This is for the individual day context menu.
   */
  dayContextMenu?: WeekDay;
  /**
   * Whether the schedule was edited. Used to prevent auto refreshes from the websocket when we've touched the schedule.
   */
  edited: boolean = false;
  /**
   * Used to keep a copy of the heating schedule, so that we always have the latest one in the deviceSchedule variable.
   * We copy it to this one on init, or on update if the "edited" variable is set to false.
   */
  schedule!: HeatingSchedule[];
  /**
   * Whether we are in mobile mode, which is when the screen width drops below 768px.
   */
  mobileMode: boolean = window.innerWidth <= 768;

  /**
   * Currently selected day in the scheduling utility.
   */
  selectedDay?: WeekDay;
  /**
   * Index (0-47) of the initial time frame for the scheduling utility.
   */
  startSectionIndex?: number;
  /**
   * Stores the height of a single section in the scheduling utility, to automatically determine how many sections were
   * selected depending on the starting position and on the cursor position.
   */
  sectionHeight?: number;
  /**
   * Starting position in pixels of the first clicked schedule section. Used to calculate how many adjacent sections
   * were selected by using sectionHeight and the cursor position.
   */
  startingPosition?: number;
  /**
   * Offset on the horizontal axis of the selected schedule section. Used to display the mode selection modal once the
   * time frame has been selected.
   */
  xOffset?: number;
  /**
   * Number of adjacent sections that should be selected starting from the initially selected one.
   */
  adjacentSections?: number;
  /**
   * Whether we are currently in dragging mode over the schedule.
   */
  dragging: boolean = false;
  /**
   * Coordinates of the heating mode selection widget.
   */
  heatingModeCoordinates?: Point;
  /**
   * Current time, used to display the current time.
   */
  now: DateTime = DateTime.now();
  /**
   * Current weekday, used to highlight the corresponding label on the schedule.
   */
  currentDay: WeekDay = WeekDay.Unknown;

  /**
   * All the keys available in the device schedule object. Used to translate a section index to an actual time.
   */
  timeKeys: string[] = [
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "00:00"
  ];

  constructor(private _api: ApiService,
              private _transloco: TranslocoService,
              private _modals: ModalsService,
              private _notifications: NotificationsService) {}

  /**
   * Initialization function.
   * It starts by setting the current weekday. It then copies the device schedule to the local schedule variable,
   * and starts the timer to display the current time on the schedule.
   */
  ngOnInit() {
    this.currentDay = Info.weekdays()[this.now.weekday - 1].toUpperCase() as WeekDay;
    this.schedule = this.deviceSchedule;
    this._initTime();
  }

  /**
   * Called when changes are detected in the @Inputs of the component.
   * @param changes The observed changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('deviceSchedule')) {
      /**
       * If we detect a change in the device schedule (generally through websocket), we only update the schedule if
       * the schedule is not being edited. It would suck to have your efforts overwritten.
       */
      if (!this.edited) {
        this.schedule = this.deviceSchedule;
      }
    }
  }

  /**
   * Called on initialization, to refresh the current time bar on the schedule every second.
   * @private
   */
  private _initTime(): void {
    setInterval(() => {
      this.now = DateTime.now();
      // If we keep the schedule open overnight, we also update the weekday to the current one.
      this.currentDay = Info.weekdays()[this.now.weekday - 1].toUpperCase() as WeekDay;
    }, 1000);
  }

  /**
   * Called when the timer mode is enabled or disabled.
   * @param mode
   */
  onSetScheduleMode(mode: boolean): void {
    this._api.deviceDeviceIdScheduleModePost({
      deviceId: this.deviceId,
      body: {
        enable: mode
      }
    }).subscribe(() => {
      // We don't need to do anything here. The websocket will auto update the value on the display.
    });
  }

  /**
   * Used to get the start of the selected time frame in order to display it on the heating mode selection popup.
   */
  getStartTime(): string {
    if (this.startSectionIndex == undefined) {
      return '';
    }
    /**
     * When adjacentSections is below zero, it means we dragged upwards. That means the first selected section is
     * actually the last, so we retrieve the time key at index startIndex - adjacentSections.
     */
    if (this.adjacentSections! < 0) {
      return this.timeKeys[this.startSectionIndex + this.adjacentSections!];
    }

    // As stated in the variables comments, we use timeKeys to translate a section index to a readable time.
    return this.timeKeys[this.startSectionIndex];
  }

  /**
   * Used to get the end of the selected time frame in order to display it on the heating mode selection popup.
   */
  getEndTime(): string {
    if (this.startSectionIndex == undefined || this.adjacentSections == undefined) {
      return '';
    }
    /**
     * When adjacentSections is below zero, it means we dragged upwards. That means the end section is actually the
     * first, so we retrieve the time key at index startIndex + 1.
     */
    if (this.adjacentSections! < 0) {
      return this.timeKeys[this.startSectionIndex + 1];
    }
    return this.timeKeys[this.startSectionIndex + this.adjacentSections + 1];
  }

  /**
   * Called when we press a heating mode after selecting a time frame to apply it to.
   * @param mode The mode that should be applied to the selected time frame.
   */
  onSelectScheduleHeatingMode(mode: HeatingMode): void {
    for (const day of this.schedule) {
      if (day.day == this.selectedDay) {
        // We loop on each day of the schedule until we find the one corresponding to the one we selected.
        let start = this.adjacentSections! < 0 ? this.startSectionIndex! + this.adjacentSections! : this.startSectionIndex!;
        let end = this.adjacentSections! < 0 ? this.startSectionIndex! : this.startSectionIndex! + this.adjacentSections!;
        // We then define our start and end bounds depending on whether we dragged upwards or downwards.
        for (let i = start; i <= end; i++) {
          // @ts-ignore - We then set all the selected sections to the selected mode.
          day.schedule[this.timeKeys[i]] = mode;
        }
      }
    }

    /**
     * Finally, we reset all the variables we use to select sections, and we mark the schedule as edited to avoid
     * websocket reloads.
     */
    this.heatingModeCoordinates = undefined;
    this.selectedDay = undefined;
    this.startSectionIndex = undefined;
    this.adjacentSections = undefined;
    this.heatingModeCoordinates = undefined;
    this.edited = true;
  }

  /**
   * Simple helper function that returns a color depending on the provided heating mode. Used to colorize the heating
   * sections.
   * @param mode The mode whose color should be returned.
   */
  getColorForHeatingMode(mode: any): string {
    switch (mode) {
      case HeatingMode.Eco:
        return '#282828'; // Good old gray!
      case HeatingMode.Comfort:
        return 'orange'; // Heatlink accent orange!
      case HeatingMode.FrostProtection:
        return 'white'; // Cold as ice!
      default:
        return 'purple'; // Purple. It's purple.
    }
  }

  /**
   * Called when a schedule section is clicked or tapped. The behavior in this function depends on the terminal
   * used by the user.
   * @param day The weekday in which the section was pressed.
   * @param sectionIndex The index (0-47) of the section that was clicked.
   * @param event The native mouse down event.
   */
  onClickSection(day: WeekDay, sectionIndex: number, event: MouseEvent): void {
    if (!this.sectionHeight) {
      /**
       * If we haven't already saved the height in pixels of a section, we do so now. This allows us to reuse it later
       * to determine how many adjacent sections are selected (using the cursor position).
       */
      this.sectionHeight = (event.target as HTMLDivElement).getBoundingClientRect().height;
    }
    if (this.mobileMode) {

      /**
       * In mobile mode, no dragging is involved. We press the first section and the second one, which will
       * automatically select the sections in between.
       */

      if (this.startSectionIndex != undefined && this.adjacentSections != undefined) {
        /**
         * If we already have a start section index and adjacent sections, it means we already had a selection.
         * That means we need to reset the previous one (-> setting adjacentSections and heatingModeCoordinates to
         * undefined).
         * We then set startingPosition, xOffset, selectedDay and startSection index to prepare for the new selection.
         */
        this.startingPosition = (event.target as HTMLDivElement).getBoundingClientRect().y + this.sectionHeight / 2;
        this.xOffset = (event.target as HTMLDivElement).getBoundingClientRect().x + (event.target as HTMLDivElement).getBoundingClientRect().width;
        this.selectedDay = day;
        this.startSectionIndex = sectionIndex;
        this.adjacentSections = undefined;
        this.heatingModeCoordinates = undefined;
        return;
      }

      if (!this.startSectionIndex) {
        /**
         * If we don't have a startSectionIndex, it means we haven't made a selection yet.
         * We set the starting position to the clicked section's y coordinates, xOffset to the section's x coordinates,
         * selectedDay to the day this section belongs to, and startSectionIndex to the index of the selected section.
         */
        this.startingPosition = (event.target as HTMLDivElement).getBoundingClientRect().y + this.sectionHeight / 2;
        this.xOffset = (event.target as HTMLDivElement).getBoundingClientRect().x + (event.target as HTMLDivElement).getBoundingClientRect().width;
        this.selectedDay = day;
        this.startSectionIndex = sectionIndex;
      } else {
        /**
         * Else, it means we have a start section index but no adjacent sections. This tap is the second one, to select
         * the end of the time frame. We only have to set adjacent sections to the second tapped section's index minus
         * the initial one.
         */
        this.adjacentSections = sectionIndex - this.startSectionIndex;
      }
    } else {
      /**
       * On a computer, we use a dragging system so that selecting ranges is more convenient.
       * We set the startingPosition, xOffset, selectedDay and startSectionIndex values accordingly (see above for more
       * information on those).
       * Then, we set adjacentSections to 0, to both reset the selection if we made one previously, and allow for
       * single section selection (should you wish to set your heating mode for a single 30-minute range).
       * We then set dragging mode to true and let the onMouseMove function do the rest.
       */
      this.startingPosition = (event.target as HTMLDivElement).getBoundingClientRect().y + this.sectionHeight / 2;
      this.xOffset = (event.target as HTMLDivElement).getBoundingClientRect().x + (event.target as HTMLDivElement).getBoundingClientRect().width;
      this.selectedDay = day;
      this.startSectionIndex = sectionIndex;
      this.adjacentSections = 0;
      this.heatingModeCoordinates = undefined;
      this.dragging = true;
    }
  }

  /**
   * Called when the cursor moves anywhere on the page. It's better to use a host listener for this, as restricting it
   * to the actual schedule DOM event would mean we'd have to keep the cursor on the day area at all times.
   * @param event The native mouse move event.
   */
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    // Only executes if we have a selected day, section, and if we're in dragging mode
    if (this.selectedDay && this.startSectionIndex != undefined && this.dragging) {

      /**
       * Users can drag downwards or upwards. That means we need to account for the fact that the rounding (to select
       * the section nearest to the cursor) has to be either a floor or a ceil, depending on the direction.
       */
      this.adjacentSections = this.adjacentSections! < 0 ?
        -Math.floor((this.startingPosition! - event.clientY) / this.sectionHeight!)
        :
        -Math.ceil((this.startingPosition! - event.clientY) / this.sectionHeight!);

      // In case we went out of bounds, to make sure we don't select sections that don't exist.
      if (this.startSectionIndex! + this.adjacentSections! < 0 || this.startSectionIndex! + this.adjacentSections! > this.timeKeys.length - 2) {
        if (this.adjacentSections! < 0) {
          this.adjacentSections = -this.startSectionIndex!;
        } else {
          this.adjacentSections = this.timeKeys.length - 2 - this.startSectionIndex!;
        }
      }
    }
  }

  /**
   * Called when the mouse click is released. Same scenario as the mouseMove function: we need this to work event when
   * we are not hovering the day in which the section was selected.
   * @param event The native mouse up event.
   */
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.mobileMode) {
      /**
       * If we are using a mobile device, and we have a startSectionIndex and adjacentSections, it means our mouse up
       * event is from the second tap. That means we can display the heating mode selection popup.
       */
      if (this.startSectionIndex != undefined && this.adjacentSections != undefined) {
        /**
         * We set the heating mode selection modal coordinates:
         * - X is the same as the initially selected section's X coordinate;
         * - Y is adjusted to appear near the position of the final tap, to make selection easier.
         */
        this.heatingModeCoordinates = {
          x: this.xOffset!  - this.scheduleWrapper.nativeElement.getBoundingClientRect().x,
          y: (this.startingPosition! + this.adjacentSections! * this.sectionHeight!) - this.scheduleWrapper.nativeElement.getBoundingClientRect().y + this.sectionHeight! / 2
        };
      }
    } else {
      /**
       * If we are using a computer or a wide-screen device, and we have a selectedDay and startSection index, it means
       * we are done dragging.
       */
      if (this.selectedDay && this.startSectionIndex != undefined) {
        // We disable the dragging, and set the popup coordinates (see above for info on the coordinates).
        this.dragging = false;
        this.heatingModeCoordinates = {
          x: this.xOffset!  - this.scheduleWrapper.nativeElement.getBoundingClientRect().x,
          y: (this.startingPosition! + this.adjacentSections! * this.sectionHeight!) - this.scheduleWrapper.nativeElement.getBoundingClientRect().y + this.sectionHeight! / 2
        };
      }
    }
  }

  /**
   * Called when the close button is pressed. It sends an event to the parent component to remove the heating schedule
   * widget from the DOM.
   */
  onCloseSchedulingUtility(): void {
    this.close.emit();
  }

  /**
   * Called when the save schedule button is pressed.
   * It displays a loading spinner on the button and shows a notification once the schedule has been updated on the
   * Heatzy side.
   */
  onSaveSchedule(): void {
    this.loading = true;
    this._api.deviceDeviceIdSchedulePost({
      deviceId: this.deviceId,
      body: this.schedule
    }).subscribe(() => {
      this.loading = false;
      this.edited = false; // We also make sure the schedule is no longer marked as edited once it's saved.
      this._notifications._notify({ body: this._transloco.translate('heating-schedule-updated-notification'), icon: 'matAlarmOutline', deviceName: this.deviceName });
    });
  }

  /**
   * Allows us to get the time bar position as a percentage, to display it over the schedule.
   * Reminder: this is updated live thanks to the time init function.
   */
  getCurrentTimeBarPosition(): number {
    const currentTimeInMinutes: number = this.now.hour * 60 + this.now.minute;
    const oneDayInMinutes: number = 24 * 60;
    return currentTimeInMinutes * 100 / oneDayInMinutes;
  }

  /**
   * Called when the "..." icon is pressed next to the widget title.
   * Opens the context menu to manage presets or duplicate the schedule.
   */
  onOpenContextMenu(): void {
    this.contextMenu = true;
  }

  /**
   * Called when the context menu should be closed, either through an external click or an item click.
   */
  onCloseContextMenu(): void {
    this.contextMenu = false;
  }

  /**
   * Called when the "Save as preset" item is clicked in the context menu.
   * It opens a modal that allows the user to set a name and optional description for the preset. The provided callback
   * is called once the "Confirm" button is pressed in the modal. It then displays a notification once it's properly
   * persisted.
   */
  onSavePreset(): void {
    this.contextMenu = false;
    this._modals.onOpenNewPresetModal({
      schedule: this.schedule,
      deviceName: this.deviceName,
      callback: () => {
        this._notifications._notify({ body: this._transloco.translate('preset-saved-notification'), icon: 'matSaveOutline', deviceName: this.deviceName });
      }
    });
  }

  /**
   * Called when the "Load preset" item is clicked in the context menu.
   * It opens a modal that allows the user to pick a preset to apply to the schedule. The provided callback
   * is called once the "Confirm" button is pressed in the modal, with the selected preset as a parameter. The preset
   * is then loaded, and a notification is displayed.
   */
  onLoadPreset(): void {
    this.contextMenu = false;
    this._modals.onOpenLoadPresetModal({
      callback: (preset) => {
        this.schedule = JSON.parse(preset.json);
        this.edited = true;
        this._notifications._notify({ body: this._transloco.translate('preset-loaded-notification'), icon: 'matFileUploadOutline', deviceName: this.deviceName });
      }
    });
  }

  /**
   * Called when the day context menu should be opened when clicking the label of a day on the schedule.
   * @param day The day that was clicked (used to determine where the context menu will be displayed).
   */
  onOpenDayContextMenu(day: WeekDay): void {
    this.dayContextMenu = day;
  }

  /**
   * Called when the day context menu should be closed, either through an outside click or an item click.
   */
  onCloseDayContextMenu(): void {
    this.dayContextMenu = undefined;
  }

  /**
   * Called when the copy to days item is pressed in a day context menu.
   * It opens a modal that will let the user choose which days to copy this schedule to. Once the confirm button
   * is pressed, it'll call the provided callback in order to duplicate the schedule to selected days.
   * @param schedule The schedule that should be copied to other days. Provided through the HTML template.
   */
  onCopyDaySchedule(schedule: HeatingSchedule) {
    this.dayContextMenu = undefined;
    this._modals.onOpenCopyDayScheduleModal({
      schedule,
      callback: (days: string[]) => {
        this.edited = true;
        for (const day of this.schedule) {
          if (days.includes(day.day)) {
            /**
             * For each day that we selected, we do a deep copy of the schedule.
             * If we didn't and copied the Wednesday schedule to Friday for instance, changing the Wednesday schedule
             * afterward would also update the Friday one. Love variable references.
             */
            day.schedule = Object.assign({}, schedule.schedule);
          }
        }
      }
    });
  }

  /**
   * Called when the copy to devices item is pressed in the context menu.
   * It opens a modal that will let the user choose which devices to copy this schedule to. Once the confirm button
   * is pressed, it'll call the provided callback in order to update all selected devices with this device's schedule.
   */
  onCopyScheduleToDevices(): void {
    this.contextMenu = false;
    this._modals.onOpenCopyToDevicesModal({
      deviceId: this.deviceId,
      callback: (deviceIds: string[]) => {
        const requests: Observable<void>[] = [];
        for (const deviceId of deviceIds) {
          // We loop on all the selected devices and push the requests in an array.
          requests.push(this._api.deviceDeviceIdSchedulePost({
            deviceId: deviceId,
            body: this.schedule
          }));
        }
        /**
         * We then do a forkjoin on all our requests, to centralize all of our calls here and display one notification
         * once they're all done.
         */
        forkJoin(requests).subscribe(() => {
          this._notifications._notify({ body: this._transloco.translate('schedule-copied-to-devices-notification'), icon: 'matSaveOutline', deviceName: this.deviceName });
        });
      }
    })
  }

  /**
   * Called when the screen is resized. Used to make sure the mobileMode variable is updated if the screen width
   * changes.
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.mobileMode = window.innerWidth <= 768;
  }

  protected readonly HeatingMode = HeatingMode;
  protected readonly isBetween = isBetween;
  protected readonly WeekDay = WeekDay;
}
