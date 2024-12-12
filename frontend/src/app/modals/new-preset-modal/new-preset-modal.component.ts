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

  @Input({ required: true }) config!: PresetModalConfig;

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  name?: string;
  description?: string;
  loading: boolean = false;

  constructor(private _api: ApiService,
              private _transloco: TranslocoService,
              private _notifications: NotificationsService) {}

  onCancel(): void {
    this.cancel.emit();
  }

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
      if (err.status == 409) {
        this._notifications._notify({ body: this._transloco.translate('preset-already-exists-notification'), icon: 'matCloseOutline', deviceName: this.config.deviceName });
      }
    });
  }

}
