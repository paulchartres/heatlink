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

  @Input({ required: true }) config!: CopyToDevicesModalConfig;

  @Output() cancel: EventEmitter<void> = new EventEmitter();

  selectedDevices: string[] = [];

  constructor(public data: DataService) {}

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.config.callback(this.selectedDevices);
    this.onCancel();
  }

  onToggleDevice(state: boolean, deviceId: string): void {
    if (state) {
      this.selectedDevices.push(deviceId);
    } else {
      this.selectedDevices.splice(this.selectedDevices.indexOf(deviceId), 1);
    }
  }

}
