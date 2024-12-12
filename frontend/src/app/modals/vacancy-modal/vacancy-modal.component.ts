import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatLuxonDateModule} from "@angular/material-luxon-adapter";
import {DateTime} from "luxon";
import {FormsModule} from "@angular/forms";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {ModalConfig} from "../../models/modal-config";
import {TranslocoDirective} from "@jsverse/transloco";
import {LocaleService} from "../../services/locale/locale.service";
import {DateAdapter} from "@angular/material/core";
import {fadeAnimation} from "../../animations/fade-in-out.animation";

@Component({
  selector: 'app-vacancy-modal',
  standalone: true,
  imports: [
    MatInputModule,
    MatLuxonDateModule,
    MatDatepickerModule,
    FormsModule,
    ClickOutsideDirective,
    TranslocoDirective
  ],
  templateUrl: './vacancy-modal.component.html',
  styleUrl: './vacancy-modal.component.scss',
  animations: [fadeAnimation],
  host: { '[@fade]': '' }
})
export class VacancyModalComponent implements OnInit {

  @Input({ required: true }) config!: ModalConfig;

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  targetDate: DateTime = DateTime.now().startOf('day').plus({ day: 1 });
  today: DateTime = DateTime.now().startOf('day');
  tomorrow: DateTime = DateTime.now().startOf('day').plus({ day: 1 });
  maxDate: DateTime = DateTime.now().startOf('day').plus({ day: 30 });

  constructor(public locale: LocaleService,
              private adapter: DateAdapter<any>) {}

  ngOnInit() {
    this.adapter.setLocale(this.locale.getCurrentLocale());
  }

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
