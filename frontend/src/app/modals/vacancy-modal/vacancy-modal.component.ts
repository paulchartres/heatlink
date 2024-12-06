import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatLuxonDateModule} from "@angular/material-luxon-adapter";
import {DateTime} from "luxon";
import {FormsModule} from "@angular/forms";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {ModalConfig} from "../../models/modal-config";

@Component({
  selector: 'app-vacancy-modal',
  standalone: true,
  imports: [
    MatInputModule,
    MatLuxonDateModule,
    MatDatepickerModule,
    FormsModule,
    ClickOutsideDirective
  ],
  templateUrl: './vacancy-modal.component.html',
  styleUrl: './vacancy-modal.component.scss'
})
export class VacancyModalComponent {

  @Input({ required: true }) config!: ModalConfig;

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  targetDate: DateTime = DateTime.now().startOf('day').plus({ day: 1 });
  today: DateTime = DateTime.now().startOf('day');
  tomorrow: DateTime = DateTime.now().startOf('day').plus({ day: 1 });
  maxDate: DateTime = DateTime.now().startOf('day').plus({ day: 30 });

  onConfirm(): void {
    this.config.callback(this.config.deviceId, Math.round(this.targetDate.diff(this.today).as('days')));
    this.onCancel();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  protected readonly DateTime = DateTime;
  protected readonly Math = Math;
}
