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

  /**
   * Configuration object required to instantiate this modal.
   * The most important part of it is the callback that is called when the "Confirm" button is pressed.
   */
  @Input({ required: true }) config!: CopyDayScheduleModalConfig;

  /**
   * Event emitted when the user presses the cancel button in the modal. It won't trigger the callback function.
   */
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  /**
   * The days that have been selected using the checkboxes in the modal. Double-bound to the checkboxes.
   */
  selectedDays: WeekDay[] = [];

  /**
   * Called when the "Cancel" button is pressed. It emits on the "cancel" event emitter.
   */
  onCancel(): void {
    this.cancel.emit();
  }

  /**
   * Called when a checkbox is clicked. It's a classic flip-flop to either add the selected day to the selectedDays
   * array, or to splice it.
   * @param state Whether the checkbox was checked or unchecked.
   * @param day The day that is linked to the checkbox.
   */
  onToggleDay(state: boolean, day: WeekDay): void {
    if (state) {
      this.selectedDays.push(day);
    } else {
      this.selectedDays.splice(this.selectedDays.indexOf(day), 1);
    }
  }

  /**
   * Called when the "Confirm" button is pressed. It executes the callback provided in the config object, and calls the
   * cancel function in order to close the modal.
   * It provides the selected days through the callback for the instantiating source to use.
   */
  onConfirm(): void {
    this.config.callback(this.selectedDays);
    this.onCancel();
  }

  protected readonly WeekDay = WeekDay;
}
