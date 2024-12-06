import {Component, ElementRef, EventEmitter, HostListener, Output, ViewChild} from '@angular/core';
import {HeatingMode} from "../../services/api/models/heating-mode";
import {isBetween} from "../../helpers/math.helper";
import {CommonModule, KeyValuePipe} from "@angular/common";
import {NgIcon} from "@ng-icons/core";
import {HeatingSchedule} from "../../services/api/models/heating-schedule";
import {WeekDay} from "../../services/api/models/week-day";
import {Point} from "../../models/point.model";
import {fadeAnimation} from "../../animations/fade-in-out.animation";

@Component({
  selector: 'app-heating-schedule',
  standalone: true,
    imports: [
        CommonModule,
        NgIcon
    ],
  templateUrl: './heating-schedule.component.html',
  styleUrl: './heating-schedule.component.scss',
  animations: [fadeAnimation]
})
export class HeatingScheduleComponent {

  @ViewChild('scheduleWrapper') scheduleWrapper!: ElementRef<HTMLDivElement>;

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  scheduleMode: boolean = false;

  // For schedule selection
  selectedDay?: WeekDay;
  startSectionIndex?: number;
  sectionHeight?: number;
  startingPosition?: number;
  xOffset?: number;
  adjacentSections?: number;
  dragging: boolean = false;
  heatingModeCoordinates?: Point;

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
  schedule: HeatingSchedule[] = [
    {
      day: WeekDay.Monday,
      schedule: {
        "00:00": HeatingMode.Eco,
        "00:30": HeatingMode.Eco,
        "01:00": HeatingMode.Eco,
        "01:30": HeatingMode.Eco,
        "02:00": HeatingMode.Eco,
        "02:30": HeatingMode.Eco,
        "03:00": HeatingMode.Eco,
        "03:30": HeatingMode.Eco,
        "04:00": HeatingMode.Eco,
        "04:30": HeatingMode.Eco,
        "05:00": HeatingMode.Eco,
        "05:30": HeatingMode.Eco,
        "06:00": HeatingMode.Comfort,
        "06:30": HeatingMode.Comfort,
        "07:00": HeatingMode.Comfort,
        "07:30": HeatingMode.Comfort,
        "08:00": HeatingMode.Comfort,
        "08:30": HeatingMode.Comfort,
        "09:00": HeatingMode.Comfort,
        "09:30": HeatingMode.Comfort,
        "10:00": HeatingMode.Eco,
        "10:30": HeatingMode.Eco,
        "11:00": HeatingMode.Eco,
        "11:30": HeatingMode.Eco,
        "12:00": HeatingMode.Eco,
        "12:30": HeatingMode.Eco,
        "13:00": HeatingMode.Eco,
        "13:30": HeatingMode.Eco,
        "14:00": HeatingMode.Eco,
        "14:30": HeatingMode.Eco,
        "15:00": HeatingMode.Eco,
        "15:30": HeatingMode.Eco,
        "16:00": HeatingMode.Eco,
        "16:30": HeatingMode.FrostProtection,
        "17:00": HeatingMode.FrostProtection,
        "17:30": HeatingMode.FrostProtection,
        "18:00": HeatingMode.FrostProtection,
        "18:30": HeatingMode.FrostProtection,
        "19:00": HeatingMode.FrostProtection,
        "19:30": HeatingMode.FrostProtection,
        "20:00": HeatingMode.Eco,
        "20:30": HeatingMode.Eco,
        "21:00": HeatingMode.Eco,
        "21:30": HeatingMode.Eco,
        "22:00": HeatingMode.Eco,
        "22:30": HeatingMode.Eco,
        "23:00": HeatingMode.Eco,
        "23:30": HeatingMode.Eco
      }
    },
    {
      day: WeekDay.Tuesday,
      schedule: {
        "00:00": HeatingMode.Eco,
        "00:30": HeatingMode.Eco,
        "01:00": HeatingMode.Eco,
        "01:30": HeatingMode.Eco,
        "02:00": HeatingMode.Eco,
        "02:30": HeatingMode.Eco,
        "03:00": HeatingMode.Eco,
        "03:30": HeatingMode.Eco,
        "04:00": HeatingMode.Eco,
        "04:30": HeatingMode.Eco,
        "05:00": HeatingMode.Eco,
        "05:30": HeatingMode.Eco,
        "06:00": HeatingMode.Eco,
        "06:30": HeatingMode.Eco,
        "07:00": HeatingMode.Eco,
        "07:30": HeatingMode.Eco,
        "08:00": HeatingMode.Eco,
        "08:30": HeatingMode.Eco,
        "09:00": HeatingMode.Eco,
        "09:30": HeatingMode.Eco,
        "10:00": HeatingMode.Eco,
        "10:30": HeatingMode.Eco,
        "11:00": HeatingMode.Eco,
        "11:30": HeatingMode.Eco,
        "12:00": HeatingMode.Eco,
        "12:30": HeatingMode.Eco,
        "13:00": HeatingMode.Eco,
        "13:30": HeatingMode.Eco,
        "14:00": HeatingMode.Eco,
        "14:30": HeatingMode.Eco,
        "15:00": HeatingMode.Eco,
        "15:30": HeatingMode.Eco,
        "16:00": HeatingMode.Eco,
        "16:30": HeatingMode.Eco,
        "17:00": HeatingMode.Eco,
        "17:30": HeatingMode.Eco,
        "18:00": HeatingMode.Eco,
        "18:30": HeatingMode.Eco,
        "19:00": HeatingMode.Eco,
        "19:30": HeatingMode.Eco,
        "20:00": HeatingMode.Eco,
        "20:30": HeatingMode.Eco,
        "21:00": HeatingMode.Eco,
        "21:30": HeatingMode.Eco,
        "22:00": HeatingMode.Eco,
        "22:30": HeatingMode.Eco,
        "23:00": HeatingMode.Eco,
        "23:30": HeatingMode.Eco
      }
    },
    {
      day: WeekDay.Wednesday,
      schedule: {
        "00:00": HeatingMode.Eco,
        "00:30": HeatingMode.Eco,
        "01:00": HeatingMode.Eco,
        "01:30": HeatingMode.Eco,
        "02:00": HeatingMode.Eco,
        "02:30": HeatingMode.Eco,
        "03:00": HeatingMode.Eco,
        "03:30": HeatingMode.Eco,
        "04:00": HeatingMode.Eco,
        "04:30": HeatingMode.Eco,
        "05:00": HeatingMode.Eco,
        "05:30": HeatingMode.Eco,
        "06:00": HeatingMode.Eco,
        "06:30": HeatingMode.Eco,
        "07:00": HeatingMode.Eco,
        "07:30": HeatingMode.Eco,
        "08:00": HeatingMode.Eco,
        "08:30": HeatingMode.Eco,
        "09:00": HeatingMode.Eco,
        "09:30": HeatingMode.Eco,
        "10:00": HeatingMode.Eco,
        "10:30": HeatingMode.Eco,
        "11:00": HeatingMode.Eco,
        "11:30": HeatingMode.Eco,
        "12:00": HeatingMode.Eco,
        "12:30": HeatingMode.Eco,
        "13:00": HeatingMode.Eco,
        "13:30": HeatingMode.Eco,
        "14:00": HeatingMode.Eco,
        "14:30": HeatingMode.Eco,
        "15:00": HeatingMode.Eco,
        "15:30": HeatingMode.Eco,
        "16:00": HeatingMode.Eco,
        "16:30": HeatingMode.Eco,
        "17:00": HeatingMode.Eco,
        "17:30": HeatingMode.Eco,
        "18:00": HeatingMode.Eco,
        "18:30": HeatingMode.Eco,
        "19:00": HeatingMode.Eco,
        "19:30": HeatingMode.Eco,
        "20:00": HeatingMode.Eco,
        "20:30": HeatingMode.Eco,
        "21:00": HeatingMode.Eco,
        "21:30": HeatingMode.Eco,
        "22:00": HeatingMode.Eco,
        "22:30": HeatingMode.Eco,
        "23:00": HeatingMode.Eco,
        "23:30": HeatingMode.Eco
      }
    },
    {
      day: WeekDay.Thursday,
      schedule: {
        "00:00": HeatingMode.Eco,
        "00:30": HeatingMode.Eco,
        "01:00": HeatingMode.Eco,
        "01:30": HeatingMode.Eco,
        "02:00": HeatingMode.Eco,
        "02:30": HeatingMode.Eco,
        "03:00": HeatingMode.Eco,
        "03:30": HeatingMode.Eco,
        "04:00": HeatingMode.Eco,
        "04:30": HeatingMode.Eco,
        "05:00": HeatingMode.Eco,
        "05:30": HeatingMode.Eco,
        "06:00": HeatingMode.Eco,
        "06:30": HeatingMode.Eco,
        "07:00": HeatingMode.Eco,
        "07:30": HeatingMode.Eco,
        "08:00": HeatingMode.Eco,
        "08:30": HeatingMode.Eco,
        "09:00": HeatingMode.Eco,
        "09:30": HeatingMode.Eco,
        "10:00": HeatingMode.Eco,
        "10:30": HeatingMode.Eco,
        "11:00": HeatingMode.Eco,
        "11:30": HeatingMode.Eco,
        "12:00": HeatingMode.Eco,
        "12:30": HeatingMode.Eco,
        "13:00": HeatingMode.Eco,
        "13:30": HeatingMode.Eco,
        "14:00": HeatingMode.Eco,
        "14:30": HeatingMode.Eco,
        "15:00": HeatingMode.Eco,
        "15:30": HeatingMode.Eco,
        "16:00": HeatingMode.Eco,
        "16:30": HeatingMode.Eco,
        "17:00": HeatingMode.Eco,
        "17:30": HeatingMode.Eco,
        "18:00": HeatingMode.Eco,
        "18:30": HeatingMode.Eco,
        "19:00": HeatingMode.Eco,
        "19:30": HeatingMode.Eco,
        "20:00": HeatingMode.Eco,
        "20:30": HeatingMode.Eco,
        "21:00": HeatingMode.Eco,
        "21:30": HeatingMode.Eco,
        "22:00": HeatingMode.Eco,
        "22:30": HeatingMode.Eco,
        "23:00": HeatingMode.Eco,
        "23:30": HeatingMode.Eco
      }
    },
    {
      day: WeekDay.Friday,
      schedule: {
        "00:00": HeatingMode.Eco,
        "00:30": HeatingMode.Eco,
        "01:00": HeatingMode.Eco,
        "01:30": HeatingMode.Eco,
        "02:00": HeatingMode.Eco,
        "02:30": HeatingMode.Eco,
        "03:00": HeatingMode.Eco,
        "03:30": HeatingMode.Eco,
        "04:00": HeatingMode.Eco,
        "04:30": HeatingMode.Eco,
        "05:00": HeatingMode.Eco,
        "05:30": HeatingMode.Eco,
        "06:00": HeatingMode.Eco,
        "06:30": HeatingMode.Eco,
        "07:00": HeatingMode.Eco,
        "07:30": HeatingMode.Eco,
        "08:00": HeatingMode.Eco,
        "08:30": HeatingMode.Eco,
        "09:00": HeatingMode.Eco,
        "09:30": HeatingMode.Eco,
        "10:00": HeatingMode.Eco,
        "10:30": HeatingMode.Eco,
        "11:00": HeatingMode.Eco,
        "11:30": HeatingMode.Eco,
        "12:00": HeatingMode.Eco,
        "12:30": HeatingMode.Eco,
        "13:00": HeatingMode.Eco,
        "13:30": HeatingMode.Eco,
        "14:00": HeatingMode.Eco,
        "14:30": HeatingMode.Eco,
        "15:00": HeatingMode.Eco,
        "15:30": HeatingMode.Eco,
        "16:00": HeatingMode.Eco,
        "16:30": HeatingMode.Eco,
        "17:00": HeatingMode.Eco,
        "17:30": HeatingMode.Eco,
        "18:00": HeatingMode.Eco,
        "18:30": HeatingMode.Eco,
        "19:00": HeatingMode.Eco,
        "19:30": HeatingMode.Eco,
        "20:00": HeatingMode.Eco,
        "20:30": HeatingMode.Eco,
        "21:00": HeatingMode.Eco,
        "21:30": HeatingMode.Eco,
        "22:00": HeatingMode.Eco,
        "22:30": HeatingMode.Eco,
        "23:00": HeatingMode.Eco,
        "23:30": HeatingMode.Eco
      }
    },
    {
      day: WeekDay.Saturday,
      schedule: {
        "00:00": HeatingMode.Eco,
        "00:30": HeatingMode.Eco,
        "01:00": HeatingMode.Eco,
        "01:30": HeatingMode.Eco,
        "02:00": HeatingMode.Eco,
        "02:30": HeatingMode.Eco,
        "03:00": HeatingMode.Eco,
        "03:30": HeatingMode.Eco,
        "04:00": HeatingMode.Eco,
        "04:30": HeatingMode.Eco,
        "05:00": HeatingMode.Eco,
        "05:30": HeatingMode.Eco,
        "06:00": HeatingMode.Eco,
        "06:30": HeatingMode.Eco,
        "07:00": HeatingMode.Eco,
        "07:30": HeatingMode.Eco,
        "08:00": HeatingMode.Eco,
        "08:30": HeatingMode.Eco,
        "09:00": HeatingMode.Eco,
        "09:30": HeatingMode.Eco,
        "10:00": HeatingMode.Eco,
        "10:30": HeatingMode.Eco,
        "11:00": HeatingMode.Eco,
        "11:30": HeatingMode.Eco,
        "12:00": HeatingMode.Eco,
        "12:30": HeatingMode.Eco,
        "13:00": HeatingMode.Eco,
        "13:30": HeatingMode.Eco,
        "14:00": HeatingMode.Eco,
        "14:30": HeatingMode.Eco,
        "15:00": HeatingMode.Eco,
        "15:30": HeatingMode.Eco,
        "16:00": HeatingMode.Eco,
        "16:30": HeatingMode.Eco,
        "17:00": HeatingMode.Eco,
        "17:30": HeatingMode.Eco,
        "18:00": HeatingMode.Eco,
        "18:30": HeatingMode.Eco,
        "19:00": HeatingMode.Eco,
        "19:30": HeatingMode.Eco,
        "20:00": HeatingMode.Eco,
        "20:30": HeatingMode.Eco,
        "21:00": HeatingMode.Eco,
        "21:30": HeatingMode.Eco,
        "22:00": HeatingMode.Eco,
        "22:30": HeatingMode.Eco,
        "23:00": HeatingMode.Eco,
        "23:30": HeatingMode.Eco
      }
    },
    {
      day: WeekDay.Sunday,
      schedule: {
        "00:00": HeatingMode.Eco,
        "00:30": HeatingMode.Eco,
        "01:00": HeatingMode.Eco,
        "01:30": HeatingMode.Eco,
        "02:00": HeatingMode.Eco,
        "02:30": HeatingMode.Eco,
        "03:00": HeatingMode.Eco,
        "03:30": HeatingMode.Eco,
        "04:00": HeatingMode.Eco,
        "04:30": HeatingMode.Eco,
        "05:00": HeatingMode.Eco,
        "05:30": HeatingMode.Eco,
        "06:00": HeatingMode.Eco,
        "06:30": HeatingMode.Eco,
        "07:00": HeatingMode.Eco,
        "07:30": HeatingMode.Eco,
        "08:00": HeatingMode.Eco,
        "08:30": HeatingMode.Eco,
        "09:00": HeatingMode.Eco,
        "09:30": HeatingMode.Eco,
        "10:00": HeatingMode.Eco,
        "10:30": HeatingMode.Eco,
        "11:00": HeatingMode.Eco,
        "11:30": HeatingMode.Eco,
        "12:00": HeatingMode.Eco,
        "12:30": HeatingMode.Eco,
        "13:00": HeatingMode.Eco,
        "13:30": HeatingMode.Eco,
        "14:00": HeatingMode.Eco,
        "14:30": HeatingMode.Eco,
        "15:00": HeatingMode.Eco,
        "15:30": HeatingMode.Eco,
        "16:00": HeatingMode.Eco,
        "16:30": HeatingMode.Eco,
        "17:00": HeatingMode.Eco,
        "17:30": HeatingMode.Eco,
        "18:00": HeatingMode.Eco,
        "18:30": HeatingMode.Eco,
        "19:00": HeatingMode.Eco,
        "19:30": HeatingMode.Eco,
        "20:00": HeatingMode.Eco,
        "20:30": HeatingMode.Eco,
        "21:00": HeatingMode.Eco,
        "21:30": HeatingMode.Eco,
        "22:00": HeatingMode.Eco,
        "22:30": HeatingMode.Eco,
        "23:00": HeatingMode.Eco,
        "23:30": HeatingMode.Eco
      }
    },
  ];

  onSetScheduleMode(mode: boolean): void {
    this.scheduleMode = mode;
  }

  getStartTime(): string {
    if (this.startSectionIndex == undefined) {
      return '';
    }
    if (this.adjacentSections! < 0) {
      return this.timeKeys[this.startSectionIndex + this.adjacentSections!];
    }
    return this.timeKeys[this.startSectionIndex];
  }

  getEndTime(): string {
    if (this.startSectionIndex == undefined || this.adjacentSections == undefined) {
      return '';
    }
    if (this.adjacentSections! < 0) {
      return this.timeKeys[this.startSectionIndex + 1];
    }
    return this.timeKeys[this.startSectionIndex + this.adjacentSections + 1];
  }

  onSelectScheduleHeatingMode(mode: HeatingMode): void {
    for (const day of this.schedule) {
      if (day.day == this.selectedDay) {
        let start = this.adjacentSections! < 0 ? this.startSectionIndex! + this.adjacentSections! : this.startSectionIndex!;
        let end = this.adjacentSections! < 0 ? this.startSectionIndex! : this.startSectionIndex! + this.adjacentSections!;
        for (let i = start; i <= end; i++) {
          // @ts-ignore
          day.schedule[this.timeKeys[i]] = mode;
        }
      }
    }
    this.heatingModeCoordinates = undefined;
    this.selectedDay = undefined;
    this.startSectionIndex = undefined;
    this.adjacentSections = undefined;
    this.heatingModeCoordinates = undefined;
  }

  getColorForHeatingMode(mode: any): string {
    switch (mode) {
      case HeatingMode.Eco:
        return '#282828';
      case HeatingMode.Comfort:
        return 'orange';
      case HeatingMode.FrostProtection:
        return 'white';
      default:
        return 'purple';
    }
  }

  onClickSection(day: WeekDay, sectionIndex: number, event: MouseEvent): void {
    if (!this.sectionHeight) {
      this.sectionHeight = (event.target as HTMLDivElement).getBoundingClientRect().height;
    }
    this.startingPosition = (event.target as HTMLDivElement).getBoundingClientRect().y + this.sectionHeight / 2;
    this.xOffset = (event.target as HTMLDivElement).getBoundingClientRect().x + (event.target as HTMLDivElement).getBoundingClientRect().width;
    this.selectedDay = day;
    this.startSectionIndex = sectionIndex;
    this.adjacentSections = 0;
    this.heatingModeCoordinates = undefined;
    this.dragging = true;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.selectedDay && this.startSectionIndex != undefined && this.dragging) {
      this.adjacentSections = this.adjacentSections! < 0 ?
        -Math.floor((this.startingPosition! - event.clientY) / this.sectionHeight!)
        :
        -Math.ceil((this.startingPosition! - event.clientY) / this.sectionHeight!)
      ;

      // In case we went out of bounds
      if (this.startSectionIndex! + this.adjacentSections! < 0 || this.startSectionIndex! + this.adjacentSections! > this.timeKeys.length - 2) {
        if (this.adjacentSections! < 0) {
          this.adjacentSections = -this.startSectionIndex!;
        } else {
          this.adjacentSections = this.timeKeys.length - 2 - this.startSectionIndex!;
        }
      }
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.selectedDay && this.startSectionIndex != undefined) {

      this.dragging = false;
      this.heatingModeCoordinates = {
        x: this.xOffset!  - this.scheduleWrapper.nativeElement.getBoundingClientRect().x,
        y: (this.startingPosition! + this.adjacentSections! * this.sectionHeight!) - this.scheduleWrapper.nativeElement.getBoundingClientRect().y + this.sectionHeight! / 2
      };
    }
  }

  onCloseSchedulingUtility(): void {
    this.close.emit();
  }

  protected readonly HeatingMode = HeatingMode;
  protected readonly isBetween = isBetween;
}
