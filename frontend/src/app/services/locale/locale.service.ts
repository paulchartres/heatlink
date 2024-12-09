import { Injectable } from '@angular/core';
import {TranslocoService} from "@jsverse/transloco";
import {DateAdapter} from "@angular/material/core";

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  private currentLocale: string = 'en';

  constructor(private _transloco: TranslocoService) { }

  init(): void {
    let locale = localStorage.getItem('locale');
    if (locale) {
      this.setCurrentLocale(locale);
    }
  }

  setCurrentLocale(locale: string): void {
    this._transloco.setActiveLang(locale);
    this.currentLocale = locale;
    localStorage.setItem('locale', locale);
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }

}
