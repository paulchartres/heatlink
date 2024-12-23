import {Component, OnInit} from '@angular/core';
import {TranslocoDirective} from "@jsverse/transloco";
import {DateTime} from "luxon";
import {AsyncPipe, DecimalPipe} from "@angular/common";
import {TimeService} from "../../services/time/time.service";
import {LocaleService} from "../../services/locale/locale.service";
import {WeatherService} from "../../services/weather/weather.service";
import {WmoService} from "../../services/wmo/wmo.service";
import {NgScrollbar} from "ngx-scrollbar";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {matArrowBackIosOutline, matExpandLessOutline, matExpandMoreOutline} from "@ng-icons/material-icons/outline";
import {fadeAnimation} from "../../animations/fade-in-out.animation";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [
    TranslocoDirective,
    DecimalPipe,
    AsyncPipe,
    NgScrollbar,
    ClickOutsideDirective,
    NgIcon,
    RouterLink
  ],
  providers: [
    provideIcons({
      matExpandMoreOutline,
      matExpandLessOutline,
      matArrowBackIosOutline
    })
  ],
  templateUrl: './guide.component.html',
  styleUrl: './guide.component.scss',
  animations: [fadeAnimation],
})
export class GuideComponent implements OnInit {

  /**
   * Whether the language picker menu is open.
   */
  languagePicker: boolean = false;
  /**
   * Currently selected FAQ category. IDs are defined in the HTML template.
   */
  selectedCategory?: string;

  constructor(public time: TimeService,
              public locale: LocaleService,
              public wmo: WmoService,
              public weather: WeatherService) {}

  /**
   * Initialization function.
   * It initializes the locale service to fetch the current locale settings from the browser storage, starts the weather
   * service to display the corresponding widget, and starts the time service to have accurate date and time values
   * in the top bar.
   */
  ngOnInit() {
    this.locale.init();
    this.weather.init();
    this.time.init();
  }

  /**
   * Called when the language picker label is pressed. Sets the languagePicker value to true.
   */
  onOpenLanguagePicker(): void {
    this.languagePicker = true;
  }

  /**
   * Called when a click outside the language picker menu or a click on a language is detected.
   * Sets the languagePicker value to false.
   */
  onCloseLanguagePicker(): void {
    this.languagePicker = false;
  }

  /**
   * Called when a language is selected from the language picker menu.
   * Sets the selected locale in the locale service, and closes the language picker menu.
   * @param locale The selected locale code (en, fr).
   */
  onSetLocale(locale: string): void {
    this.onCloseLanguagePicker();
    this.locale.setCurrentLocale(locale);
  }

  /**
   * Called when a FAQ category is selected.
   * If the category is already selected, it deselects it.
   * @param id The ID of the selected category.
   */
  onSelectItem(id: string): void {
    if (this.selectedCategory == id) {
      this.selectedCategory = undefined;
      return;
    }
    this.selectedCategory = id;
  }

  protected readonly DateTime = DateTime;
}
