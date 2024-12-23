import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIcon, NgIconComponent, provideIcons} from "@ng-icons/core";
import {NgxGaugeModule} from "ngx-gauge";
import {matMinusOutline, matPlusOutline} from "@ng-icons/material-icons/outline";
import {DateTime, Duration} from "luxon";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {ModalConfig} from "../../models/modal-config";
import {TranslocoDirective} from "@jsverse/transloco";
import {fadeAnimation} from "../../animations/fade-in-out.animation";

@Component({
  selector: 'app-boost-modal',
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
  templateUrl: './boost-modal.component.html',
  styleUrl: './boost-modal.component.scss',
  animations: [fadeAnimation],
  host: { '[@fade]': '' }
})
export class BoostModalComponent {

  /**
   * Configuration object required to instantiate this modal.
   * The most important part of it is the callback that is called when the "Confirm" button is pressed.
   */
  @Input({ required: true }) config!: ModalConfig;

  /**
   * The boost duration in minutes. It starts at 30 but can be changed using the gauge in the modal.
   */
  boostDuration: number = 30;

  /**
   * Event emitted when the user presses the cancel button in the modal. It won't trigger the callback function.
   */
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Called when the "+" button is pressed under the gauge. It also ensures we don't go over 120 minutes.
   */
  onIncreaseBoost(): void {
    this.boostDuration = Math.max(30, Math.min(120, this.boostDuration + 30));
  }

  /**
   * Called when the "-" button is pressed under the gauge. It also ensures we don't go under 30 minutes.
   */
  onDecreaseBoost(): void {
    this.boostDuration = Math.max(30, Math.min(120, this.boostDuration - 30));
  }

  /**
   * Called when the "Confirm" button is pressed. It executes the callback provided in the config object, and calls the
   * cancel function in order to close the modal.
   */
  onConfirm(): void {
    this.config.callback(this.config.deviceId, this.boostDuration);
    this.onCancel();
  }

  /**
   * Called when the "Cancel" button is pressed. It emits on the "cancel" event emitter.
   */
  onCancel(): void {
    this.cancel.emit();
  }

  protected readonly DateTime = DateTime;
  protected readonly Duration = Duration;
}
