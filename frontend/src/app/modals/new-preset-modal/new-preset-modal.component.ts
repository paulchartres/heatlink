import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslocoDirective, TranslocoService} from "@jsverse/transloco";
import {TextInputComponent} from "../../components/text-input/text-input.component";
import {TextAreaComponent} from "../../components/text-area/text-area.component";
import {ButtonComponent} from "../../components/button/button.component";
import {ApiService} from "../../services/api/services/api.service";
import {PresetModalConfig} from "../../models/preset-modal-config";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationsService} from "../../services/notifications/notifications.service";
import {fadeAnimation} from "../../animations/fade-in-out.animation";

@Component({
  selector: 'app-new-preset-modal',
  standalone: true,
  imports: [
    TranslocoDirective,
    TextInputComponent,
    TextAreaComponent,
    ButtonComponent,
    ClickOutsideDirective
  ],
  templateUrl: './new-preset-modal.component.html',
  styleUrl: './new-preset-modal.component.scss',
  animations: [fadeAnimation],
  host: { '[@fade]': '' }
})
export class NewPresetModalComponent {

  /**
   * Configuration object required to instantiate this modal.
   * The most important part of it is the callback that is called when the "Confirm" button is pressed.
   */
  @Input({ required: true }) config!: PresetModalConfig;

  /**
   * Event emitted when the user presses the cancel button in the modal. It won't trigger the callback function.
   */
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  /**
   * The double binding for the name of the preset.
   */
  name?: string;
  /**
   * The double binding for the description of the preset. This is optional.
   */
  description?: string;
  /**
   * The loading flag to display a spinner on the button while the preset is being saved.
   */
  loading: boolean = false;

  constructor(private _api: ApiService,
              private _transloco: TranslocoService,
              private _notifications: NotificationsService) {}

  /**
   * Called when the "Cancel" button is pressed. It emits on the "cancel" event emitter.
   */
  onCancel(): void {
    this.cancel.emit();
  }

  /**
   * Called when the "Confirm" button is pressed. It persists the preset and executes the callback provided in the
   * config object once the save action is complete.
   */
  onConfirm(): void {
    this.loading = true;
    this._api.presetPost({
      body: {
        name: this.name!,
        description: this.description,
        schedule: this.config.schedule
      }
    }).subscribe(() => {
      this.loading = false;
      this.config.callback();
      this.onCancel();
    }, (err: HttpErrorResponse) => {
      this.loading = false;
      // If we get a 409 error, it means the preset already exists with the same name. We display a notification.
      if (err.status == 409) {
        this._notifications._notify({ body: this._transloco.translate('preset-already-exists-notification'), icon: 'matCloseOutline', deviceName: this.config.deviceName });
      }
    });
  }

}
