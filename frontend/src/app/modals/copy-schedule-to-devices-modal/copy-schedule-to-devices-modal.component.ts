import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {TranslocoDirective} from "@jsverse/transloco";
import {DataService} from "../../services/data/data.service";
import {CommonModule} from "@angular/common";
import {CheckboxComponent} from "../../components/checkbox/checkbox.component";
import {ButtonComponent} from "../../components/button/button.component";
import {CopyToDevicesModalConfig} from "../../models/copy-to-devices-modal-config";
import {fadeAnimation} from "../../animations/fade-in-out.animation";

@Component({
  selector: 'app-copy-schedule-to-devices-modal',
  standalone: true,
  imports: [
    CommonModule,
    ClickOutsideDirective,
    TranslocoDirective,
    CheckboxComponent,
    ButtonComponent
  ],
  templateUrl: './copy-schedule-to-devices-modal.component.html',
  styleUrl: './copy-schedule-to-devices-modal.component.scss',
  animations: [fadeAnimation],
  host: { '[@fade]': '' }
})
export class CopyScheduleToDevicesModalComponent {

  /**
   * Configuration object required to instantiate this modal.
   * The most important part of it is the callback that is called when the "Confirm" button is pressed.
   */
  @Input({ required: true }) config!: CopyToDevicesModalConfig;

  /**
   * Event emitted when the user presses the cancel button in the modal. It won't trigger the callback function.
   */
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  /**
   * The devices that have been selected using the checkboxes in the modal. Double-bound to the checkboxes.
   * The device IDs are stored in this array.
   */
  selectedDevices: string[] = [];

  constructor(public data: DataService) {}

  /**
   * Called when the "Cancel" button is pressed. It emits on the "cancel" event emitter.
   */
  onCancel(): void {
    this.cancel.emit();
  }

  /**
   * Called when the "Confirm" button is pressed. It executes the callback provided in the config object, and calls the
   * cancel function in order to close the modal.
   * It provides the selected device IDs through the callback for the instantiating source to use.
   */
  onConfirm(): void {
    this.config.callback(this.selectedDevices);
    this.onCancel();
  }

  /**
   * Called when a checkbox is clicked. It's a classic flip-flop to either add the selected device ID to the
   * selectedDays array, or to splice it.
   * @param state Whether the checkbox was checked or unchecked.
   * @param deviceId The device ID that is linked to the checkbox.
   */
  onToggleDevice(state: boolean, deviceId: string): void {
    if (state) {
      this.selectedDevices.push(deviceId);
    } else {
      this.selectedDevices.splice(this.selectedDevices.indexOf(deviceId), 1);
    }
  }

}
