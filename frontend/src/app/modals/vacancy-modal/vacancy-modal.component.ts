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
   * Target date selected by the user. Defaults at today plus one day.
   */
  targetDate: DateTime = DateTime.now().startOf('day').plus({ day: 1 });
  /**
   * Current date. Used to calculate the difference in days between the target date and today.
   */
  today: DateTime = DateTime.now().startOf('day');
  /**
   * Tomorrow's date. Used as a minimum value for the date picker, to ensure users can't pick a date before tomorrow.
   */
  tomorrow: DateTime = DateTime.now().startOf('day').plus({ day: 1 });
  /**
   * The maximum date for the date picker, to ensure users cannot pick a date later than a month after today.
   * This limitation is on the Heatzy app.
   */
  maxDate: DateTime = DateTime.now().startOf('day').plus({ day: 30 });

  constructor(public locale: LocaleService,
              private adapter: DateAdapter<any>) {}

  /**
   * Initialization function.
   * We apply the current locale to the date picker using the DateAdapter, to ensure dates are properly displayed.
   */
  ngOnInit() {
    this.adapter.setLocale(this.locale.getCurrentLocale());
  }

  /**
   * Called when the "Confirm" button is pressed. It executes the callback provided in the config object, and calls the
   * cancel function in order to close the modal.
   * It provides the device ID and amount of vacancy days in the callback.
   */
  onConfirm(): void {
    this.config.callback(this.config.deviceId, Math.round(this.targetDate.diff(this.today).as('days')));
    this.onCancel();
  }

  /**
   * Called when the "Cancel" button is pressed. It emits on the "cancel" event emitter.
   */
  onCancel(): void {
    this.cancel.emit();
  }

  protected readonly DateTime = DateTime;
  protected readonly Math = Math;
}
