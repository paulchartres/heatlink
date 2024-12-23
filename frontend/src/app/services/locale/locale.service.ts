import { Injectable } from '@angular/core';
import {TranslocoService} from "@jsverse/transloco";
import {DateAdapter} from "@angular/material/core";

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  /**
   * Current locale code used in the application.
   * @private
   */
  private currentLocale: string = 'en';

  constructor(private _transloco: TranslocoService) { }

  /**
   * Initialize the locale service (has to be called externally on init).
   * It will set the current locale to the one stored in the local storage, if applicable.
   */
  init(): void {
    let locale = localStorage.getItem('locale');
    if (locale) {
      this.setCurrentLocale(locale);
    }
  }

  /**
   * Set the current locale to the given one.
   * It will also store the locale in the local storage to keep it persistent and load it on the next visit.
   * @param locale The locale code to set (en, fr).
   */
  setCurrentLocale(locale: string): void {
    this._transloco.setActiveLang(locale);
    this.currentLocale = locale;
    localStorage.setItem('locale', locale);
  }

  /**
   * Returns the current locale code used in the application.
   */
  getCurrentLocale(): string {
    return this.currentLocale;
  }

}
