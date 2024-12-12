import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ModalConfig} from "../../models/modal-config";
import {PresetModalConfig} from "../../models/preset-modal-config";
import {Preset} from "../api/models/preset";
import {LoadPresetModalConfig} from "../../models/load-preset-modal-config";
import {CopyDayScheduleModalConfig} from "../../models/copy-day-schedule-modal-config";

@Injectable({
  providedIn: 'root'
})
export class ModalsService {

  private _comfortTemperatureModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  private _ecoTemperatureModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  private _vacancyModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  private _boostModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  private _disableMotionDetectionModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  private _disableBoostModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  private _disableVacancyModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  private _newPresetModal$: BehaviorSubject<PresetModalConfig | undefined> = new BehaviorSubject<PresetModalConfig | undefined>(undefined);
  private _loadPresetModal$: BehaviorSubject<LoadPresetModalConfig | undefined> = new BehaviorSubject<LoadPresetModalConfig | undefined>(undefined);
  private _copyDayScheduleModal$: BehaviorSubject<CopyDayScheduleModalConfig | undefined> = new BehaviorSubject<CopyDayScheduleModalConfig | undefined>(undefined);

  constructor() { }

  onOpenComfortTemperatureModal(config: ModalConfig): void {
    this._comfortTemperatureModal$.next(config);
  }

  onCloseComfortTemperatureModal(): void {
    this._comfortTemperatureModal$.next(undefined);
  }

  getComfortTemperatureModalConfig(): Observable<ModalConfig | undefined> {
    return this._comfortTemperatureModal$.asObservable();
  }

  onOpenEcoTemperatureModal(config: ModalConfig): void {
    this._ecoTemperatureModal$.next(config);
  }

  onCloseEcoTemperatureModal(): void {
    this._ecoTemperatureModal$.next(undefined);
  }

  getEcoTemperatureModalConfig(): Observable<ModalConfig | undefined> {
    return this._ecoTemperatureModal$.asObservable();
  }

  onOpenVacancyModal(config: ModalConfig): void {
    this._vacancyModal$.next(config);
  }

  onCloseVacancyModal(): void {
    this._vacancyModal$.next(undefined);
  }

  getVacancyModalConfig(): Observable<ModalConfig | undefined> {
    return this._vacancyModal$.asObservable();
  }

  onOpenBoostModal(config: ModalConfig): void {
    this._boostModal$.next(config);
  }

  onCloseBoostModal(): void {
    this._boostModal$.next(undefined);
  }

  getBoostModalConfig(): Observable<ModalConfig | undefined> {
    return this._boostModal$.asObservable();
  }

  onOpenDisableMotionDetectionModal(config: ModalConfig): void {
    this._disableMotionDetectionModal$.next(config);
  }

  onCloseDisableMotionDetectionModal(): void {
    this._disableMotionDetectionModal$.next(undefined);
  }

  getDisableMotionDetectionModalConfig(): Observable<ModalConfig | undefined> {
    return this._disableMotionDetectionModal$.asObservable();
  }

  onOpenDisableBoostModal(config: ModalConfig): void {
    this._disableBoostModal$.next(config);
  }

  onCloseDisableBoostModal(): void {
    this._disableBoostModal$.next(undefined);
  }

  getDisableBoostModalConfig(): Observable<ModalConfig | undefined> {
    return this._disableBoostModal$.asObservable();
  }

  onOpenDisableVacancyModal(config: ModalConfig): void {
    this._disableVacancyModal$.next(config);
  }

  onCloseDisableVacancyModal(): void {
    this._disableVacancyModal$.next(undefined);
  }

  getDisableVacancyModalConfig(): Observable<ModalConfig | undefined> {
    return this._disableVacancyModal$.asObservable();
  }

  onOpenNewPresetModal(config: PresetModalConfig): void {
    this._newPresetModal$.next(config);
  }

  onCloseNewPresetModal(): void {
    this._newPresetModal$.next(undefined);
  }

  getNewPresetModalConfig(): Observable<PresetModalConfig | undefined> {
    return this._newPresetModal$.asObservable();
  }

  onOpenLoadPresetModal(config: LoadPresetModalConfig): void {
    this._loadPresetModal$.next(config);
  }

  onCloseLoadPresetModal(): void {
    this._loadPresetModal$.next(undefined);
  }

  getLoadPresetModalConfig(): Observable<LoadPresetModalConfig | undefined> {
    return this._loadPresetModal$.asObservable();
  }

  onOpenCopyDayScheduleModal(config: CopyDayScheduleModalConfig): void {
    this._copyDayScheduleModal$.next(config);
  }

  onCloseCopyDayScheduleModal(): void {
    this._copyDayScheduleModal$.next(undefined);
  }

  getCopyDayScheduleModalConfig(): Observable<CopyDayScheduleModalConfig | undefined> {
    return this._copyDayScheduleModal$.asObservable();
  }

}
