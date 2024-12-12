import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslocoDirective} from "@jsverse/transloco";
import {CheckboxComponent} from "../../components/checkbox/checkbox.component";
import {CopyDayScheduleModalConfig} from "../../models/copy-day-schedule-modal-config";
import {WeekDay} from "../../services/api/models/week-day";
import {ButtonComponent} from "../../components/button/button.component";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {fadeAnimation} from "../../animations/fade-in-out.animation";

@Component({
  selector: 'app-copy-day-schedule-modal',
  standalone: true,
  imports: [
    TranslocoDirective,
    CheckboxComponent,
    ButtonComponent,
    ClickOutsideDirective
  ],
  templateUrl: './copy-day-schedule-modal.component.html',
  styleUrl: './copy-day-schedule-modal.component.scss',
  animations: [fadeAnimation],
  host: { '[@fade]': '' }
})
export class CopyDayScheduleModalComponent {

  @Input({ required: true }) config!: CopyDayScheduleModalConfig;

  @Output() cancel: EventEmitter<void> = new EventEmitter();

  selectedDays: WeekDay[] = [];

  onCancel(): void {
    this.cancel.emit();
  }

  onToggleDay(state: boolean, day: WeekDay): void {
    if (state) {
      this.selectedDays.push(day);
    } else {
      this.selectedDays.splice(this.selectedDays.indexOf(day), 1);
    }
  }

  onConfirm(): void {
    this.config.callback(this.selectedDays);
    this.onCancel();
  }

  protected readonly WeekDay = WeekDay;
}
