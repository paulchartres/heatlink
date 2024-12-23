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

  /**
   * Configuration object required to instantiate this modal.
   * The most important part of it is the callback that is called when the "Confirm" button is pressed.
   */
  @Input({ required: true }) config!: LoadPresetModalConfig;

  /**
   * Event emitted when the user presses the cancel button in the modal. It won't trigger the callback function.
   */
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  /**
   * The list of presets to be displayed in the modal. Those are retrieved on init.
   */
  presets: Preset[] = [];

  constructor(private _api: ApiService,
              private _modals: ModalsService,
              private _transloco: TranslocoService,
              private _notifications: NotificationsService) {}

  /**
   * Initialization function.
   * It retrieves the list of presets from the backend and stores them to display them in the modal.
   */
  ngOnInit() {
    this._api.presetsGet().subscribe((presets) => {
      this.presets = presets;
    });
  }

  /**
   * Called when a preset is clicked.
   * It calls the provided callback with the selected preset in order to apply it to the schedule.
   * @param preset The preset that was selected.
   */
  onSelectPreset(preset: Preset): void {
    this.config.callback(preset);
    this.onCancel();
  }

  /**
   * Called when the delete icon is pressed on a preset item. It opens the preset delete modal, with yet another
   * callback that'll delete the selected preset if the "Confirm" button is pressed.
   * It also closes the current modal to avoid overlaying modals and doing a callback-ception.
   * @param preset The preset that should be deleted.
   * @param event The native mouse down event.
   */
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

  /**
   * Called when the "Cancel" button is pressed. It emits on the "cancel" event emitter.
   */
  onCancel(): void {
    this.cancel.emit()
  }

}
