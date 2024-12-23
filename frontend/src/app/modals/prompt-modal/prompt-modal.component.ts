import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {ModalConfig} from "../../models/modal-config";
import {TranslocoDirective} from "@jsverse/transloco";
import {fadeAnimation} from "../../animations/fade-in-out.animation";

@Component({
  selector: 'app-prompt-modal',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    TranslocoDirective
  ],
  templateUrl: './prompt-modal.component.html',
  styleUrl: './prompt-modal.component.scss',
  animations: [fadeAnimation],
  host: { '[@fade]': '' }
})
export class PromptModalComponent {

  /**
   * This is for a generic prompt modal. I didn't want to make a specific prompt every single time so this was
   * the most convenient solution.
   */

  /**
   * Main body of the prompt.
   */
  @Input({ required: true }) body!: string;
  /**
   * Title of the modal.
   * Fun fact: I keep using "title" as the @Input name, but that keeps conflicting with the default HTML "title" value.
   */
  @Input({ required: true }) label!: string;
  /**
   * Configuration object required to instantiate this modal.
   * The most important part of it is the callback that is called when the "Confirm" button is pressed.
   */
  @Input({ required: true }) config!: ModalConfig;

  /**
   * Event emitted when the user presses the cancel button in the modal. It won't trigger the callback function.
   */
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Called when the "Confirm" button is pressed. It executes the callback provided in the config object, and calls the
   * cancel function in order to close the modal.
   * We also send 0 as the value, because I didn't plan ahead for cases where modals did not actually need to return a
   * value.
   */
  onConfirm(): void {
    this.config.callback(this.config.deviceId, 0);
    this.onCancel();
  }

  /**
   * Called when the "Cancel" button is pressed. It emits on the "cancel" event emitter.
   */
  onCancel(): void {
    this.cancel.emit();
  }

}
