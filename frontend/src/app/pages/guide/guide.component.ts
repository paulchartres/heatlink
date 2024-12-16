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

  languagePicker: boolean = false;
  selectedCategory?: string;

  constructor(public time: TimeService,
              public locale: LocaleService,
              public wmo: WmoService,
              public weather: WeatherService) {}

  ngOnInit() {
    this.locale.init();
    this.weather.init();
    this.time.init();
  }

  onOpenLanguagePicker(): void {
    this.languagePicker = true;
  }

  onCloseLanguagePicker(): void {
    this.languagePicker = false;
  }

  onSetLocale(locale: string): void {
    this.onCloseLanguagePicker();
    this.locale.setCurrentLocale(locale);
  }

  onSelectItem(id: string): void {
    if (this.selectedCategory == id) {
      this.selectedCategory = undefined;
      return;
    }
    this.selectedCategory = id;
  }

  protected readonly DateTime = DateTime;
}
