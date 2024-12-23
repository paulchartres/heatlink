import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgxGaugeModule} from "ngx-gauge";
import {NgIconComponent, NgIconsModule, provideIcons} from "@ng-icons/core";
import {matMinusOutline, matPlusOutline} from "@ng-icons/material-icons/outline";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {ModalConfig} from "../../models/modal-config";
import {TranslocoDirective} from "@jsverse/transloco";
import {fadeAnimation} from "../../animations/fade-in-out.animation";

@Component({
  selector: 'app-temperature-modal',
  standalone: true,
  imports: [
    NgxGaugeModule,
    NgIconComponent,
    ClickOutsideDirective,
    TranslocoDirective
  ],
  providers: [
    provideIcons({
      matPlusOutline,
      matMinusOutline
    })
  ],
  templateUrl: './temperature-modal.component.html',
  styleUrl: './temperature-modal.component.scss',
  animations: [fadeAnimation],
  host: { '[@fade]': '' }
})
export class TemperatureModalComponent implements OnInit {

  /**
   * Since the mechanics for comfort and eco temperature setting are the same, I decided to make a bit of a modular
   * modal that I could use for both. That's why there are so many inputs on this one.
   */

  /**
   * The minimum temperature value for the gauge.
   */
  @Input({ required: true }) min!: number;
  /**
   * The maximum temperature value for the gauge.
   */
  @Input({ required: true }) max!: number;
  /**
   * The current temperature value. Can be changed using the -/+ buttons under the gauge.
   */
  @Input({ required: true }) temperature!: number;
  /**
   * The title displayed in the modal.
   */
  @Input({ required: true }) label!: string;
  /**
   * Configuration object required to instantiate this modal.
   * The most important part of it is the callback that is called when the "Confirm" button is pressed.
   */
  @Input({ required: true }) config!: ModalConfig;

  /**
   * Called when the "Cancel" button is pressed. It emits on the "cancel" event emitter.
   */
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Initialization function.
   * Used to apply the default value to the temperature gauge if provided in the modal configuration object.
   */
  ngOnInit() {
    if (this.config.defaultValue) {
      this.temperature = this.config.defaultValue;
    }
  }

  /**
   * Called when the "+" button is pressed under the gauge. It increases in increments of 0.5 degrees Celsius, and is
   * clamped to the provided min/max values.
   */
  onIncreaseTemperature(): void {
    this.temperature = Math.max(this.min, Math.min(this.max, this.temperature + 0.5));
  }

  /**
   * Called when the "-" button is pressed under the gauge. It decreases in decrements of 0.5 degrees Celsius, and is
   * clamped to the provided min/max values.
   */
  onDecreaseTemperature(): void {
    this.temperature = Math.max(this.min, Math.min(this.max, this.temperature - 0.5));
  }

  /**
   * Called when the "Confirm" button is pressed. It executes the callback provided in the config object, and calls the
   * cancel function in order to close the modal.
   * It sends the target temperature and the device ID in the callback.
   */
  onConfirm(): void {
    this.config.callback(this.config.deviceId, this.temperature);
    this.onCancel();
  }

  /**
   * Called when the "Cancel" button is pressed. It emits on the "cancel" event emitter.
   */
  onCancel(): void {
    this.cancel.emit();
  }

}
