import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {TranslocoDirective} from "@jsverse/transloco";
import {ApiService} from "../../services/api/services/api.service";
import {Preset} from "../../services/api/models/preset";
import {ButtonComponent} from "../../components/button/button.component";
import {LoadPresetModalConfig} from "../../models/load-preset-modal-config";
import {NgScrollbar} from "ngx-scrollbar";

@Component({
  selector: 'app-choose-preset-modal',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    TranslocoDirective,
    ButtonComponent,
    NgScrollbar
  ],
  templateUrl: './choose-preset-modal.component.html',
  styleUrl: './choose-preset-modal.component.scss'
})
export class ChoosePresetModalComponent implements OnInit {

  @Input({ required: true }) config!: LoadPresetModalConfig;

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  presets: Preset[] = [];

  constructor(private _api: ApiService) {}

  ngOnInit() {
    this._api.presetsGet().subscribe((presets) => {
      this.presets = presets;
    });
  }

  onSelectPreset(preset: Preset): void {
    this.config.callback(preset);
    this.onCancel();
  }

  onCancel(): void {
    this.cancel.emit()
  }

}
