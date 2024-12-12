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

  @Input({ required: true }) config!: ModalConfig;

  boostDuration: number = 30;

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  onIncreaseBoost(): void {
    this.boostDuration = Math.max(30, Math.min(120, this.boostDuration + 30));
  }

  onDecreaseBoost(): void {
    this.boostDuration = Math.max(30, Math.min(120, this.boostDuration - 30));
  }

  onConfirm(): void {
    this.config.callback(this.config.deviceId, this.boostDuration);
    this.onCancel();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  protected readonly DateTime = DateTime;
  protected readonly Duration = Duration;
}
