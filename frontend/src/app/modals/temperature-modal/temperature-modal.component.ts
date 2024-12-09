import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgxGaugeModule} from "ngx-gauge";
import {NgIconComponent, NgIconsModule, provideIcons} from "@ng-icons/core";
import {matMinusOutline, matPlusOutline} from "@ng-icons/material-icons/outline";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {ModalConfig} from "../../models/modal-config";
import {TranslocoDirective} from "@jsverse/transloco";

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
  styleUrl: './temperature-modal.component.scss'
})
export class TemperatureModalComponent implements OnInit {

  @Input({ required: true }) min!: number;
  @Input({ required: true }) max!: number;
  @Input({ required: true }) temperature!: number;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) config!: ModalConfig;

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit() {
    if (this.config.defaultValue) {
      this.temperature = this.config.defaultValue;
    }
  }

  onIncreaseTemperature(): void {
    this.temperature = Math.max(this.min, Math.min(this.max, this.temperature + 0.5));
  }

  onDecreaseTemperature(): void {
    this.temperature = Math.max(this.min, Math.min(this.max, this.temperature - 0.5));
  }

  onConfirm(): void {
    this.config.callback(this.config.deviceId, this.temperature);
    this.onCancel();
  }

  onCancel(): void {
    this.cancel.emit();
  }

}
