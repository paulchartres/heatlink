import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {ModalConfig} from "../../models/modal-config";
import {TranslocoDirective} from "@jsverse/transloco";

@Component({
  selector: 'app-prompt-modal',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    TranslocoDirective
  ],
  templateUrl: './prompt-modal.component.html',
  styleUrl: './prompt-modal.component.scss'
})
export class PromptModalComponent {

  @Input({ required: true }) body!: string;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) config!: ModalConfig;

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  onConfirm(): void {
    this.config.callback(this.config.deviceId, 0);
    this.onCancel();
  }

  onCancel(): void {
    this.cancel.emit();
  }

}
