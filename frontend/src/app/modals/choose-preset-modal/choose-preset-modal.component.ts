import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {TranslocoDirective, TranslocoService} from "@jsverse/transloco";
import {ApiService} from "../../services/api/services/api.service";
import {Preset} from "../../services/api/models/preset";
import {ButtonComponent} from "../../components/button/button.component";
import {LoadPresetModalConfig} from "../../models/load-preset-modal-config";
import {NgScrollbar} from "ngx-scrollbar";
import {fadeAnimation} from "../../animations/fade-in-out.animation";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {matDeleteOutline} from "@ng-icons/material-icons/outline";
import {ModalsService} from "../../services/modals/modals.service";
import {NotificationsService} from "../../services/notifications/notifications.service";

@Component({
  selector: 'app-choose-preset-modal',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    TranslocoDirective,
    ButtonComponent,
    NgScrollbar,
    NgIcon
  ],
  providers: [
    provideIcons({
      matDeleteOutline
    })
  ],
  templateUrl: './choose-preset-modal.component.html',
  styleUrl: './choose-preset-modal.component.scss',
  animations: [fadeAnimation],
  host: { '[@fade]': '' }
})
export class ChoosePresetModalComponent implements OnInit {

  @Input({ required: true }) config!: LoadPresetModalConfig;

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  presets: Preset[] = [];

  constructor(private _api: ApiService,
              private _modals: ModalsService,
              private _transloco: TranslocoService,
              private _notifications: NotificationsService) {}

  ngOnInit() {
    this._api.presetsGet().subscribe((presets) => {
      this.presets = presets;
    });
  }

  onSelectPreset(preset: Preset): void {
    this.config.callback(preset);
    this.onCancel();
  }

  onDeletePreset(preset: Preset, event: MouseEvent): void {
    event.stopPropagation();
    this._modals.onOpenDeletePresetModal({
      callback: () => {
        this._api.presetDelete({
          body: {
            name: preset.name
          }
        }).subscribe(() => {
          this._notifications._notify({ body: this._transloco.translate('preset-deleted-notification'), icon: 'matDeleteOutline', deviceName: '' });
        });
      },
      deviceId: ''
    });
    this.onCancel();
  }

  onCancel(): void {
    this.cancel.emit()
  }

}
