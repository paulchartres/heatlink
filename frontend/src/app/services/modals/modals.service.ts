import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ModalConfig} from "../../models/modal-config";
import {PresetModalConfig} from "../../models/preset-modal-config";
import {Preset} from "../api/models/preset";
import {LoadPresetModalConfig} from "../../models/load-preset-modal-config";
import {CopyDayScheduleModalConfig} from "../../models/copy-day-schedule-modal-config";
import {CopyToDevicesModalConfig} from "../../models/copy-to-devices-modal-config";

@Injectable({
  providedIn: 'root'
})
export class ModalsService {

  /**
   * Behavior subject that contains the modal configuration for the comfort temperature modal. The main application
   * template uses this to display the modal. If undefined, the modal is not displayed.
   * @private
   */
  private _comfortTemperatureModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  /**
   * Behavior subject that contains the modal configuration for the eco temperature modal. The main application
   * template uses this to display the modal. If undefined, the modal is not displayed.
   * @private
   */
  private _ecoTemperatureModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  /**
   * Behavior subject that contains the modal configuration for the vacancy modal. The main application
   * template uses this to display the modal. If undefined, the modal is not displayed.
   * @private
   */
  private _vacancyModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  /**
   * Behavior subject that contains the modal configuration for the boost modal. The main application
   * template uses this to display the modal. If undefined, the modal is not displayed.
   * @private
   */
  private _boostModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  /**
   * Behavior subject that contains the modal configuration for the disable motion detection prompt modal. The main application
   * template uses this to display the modal. If undefined, the modal is not displayed.
   * @private
   */
  private _disableMotionDetectionModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  /**
   * Behavior subject that contains the modal configuration for the disable boost prompt modal. The main application
   * template uses this to display the modal. If undefined, the modal is not displayed.
   * @private
   */
  private _disableBoostModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  /**
   * Behavior subject that contains the modal configuration for the disable vacancy prompt modal. The main application
   * template uses this to display the modal. If undefined, the modal is not displayed.
   * @private
   */
  private _disableVacancyModal$: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);
  /**
   * Behavior subject that contains the modal configuration for the new preset modal. The main application
   * template uses this to display the modal. If undefined, the modal is not displayed.
   * @private
   */
  private _newPresetModal$: BehaviorSubject<PresetModalConfig | undefined> = new BehaviorSubject<PresetModalConfig | undefined>(undefined);
  /**
   * Behavior subject that contains the modal configuration for the load preset modal. The main application
   * template uses this to display the modal. If undefined, the modal is not displayed.
   * @private
   */
  private _loadPresetModal$: BehaviorSubject<LoadPresetModalConfig | undefined> = new BehaviorSubject<LoadPresetModalConfig | undefined>(undefined);
  /**
   * Behavior subject that contains the modal configuration for the copy schedule to days modal. The main application
   * template uses this to display the modal. If undefined, the modal is not displayed.
   * @private
   */
  private _copyDayScheduleModal$: BehaviorSubject<CopyDayScheduleModalConfig | undefined> = new BehaviorSubject<CopyDayScheduleModalConfig | undefined>(undefined);
  /**
   * Behavior subject that contains the modal configuration for the copy schedule to devices modal. The main application
   * template uses this to display the modal. If undefined, the modal is not displayed.
   * @private
   */
  private _copyScheduleToDevicesModal$: BehaviorSubject<CopyToDevicesModalConfig | undefined> = new BehaviorSubject<CopyToDevicesModalConfig | undefined>(undefined);
  /**
   * Behavior subject that contains the modal configuration for the delete preset modal. The main application
   * template uses this to display the modal. If undefined, the modal is not displayed.
   * @private
   */
  private _deletePresetModal: BehaviorSubject<ModalConfig | undefined> = new BehaviorSubject<ModalConfig | undefined>(undefined);

  constructor() { }

  /**
   * Opens the comfort temperature modal with the given configuration.
   * @param config The configuration for the modal.
   */
  onOpenComfortTemperatureModal(config: ModalConfig): void {
    this._comfortTemperatureModal$.next(config);
  }

  /**
   * Closes the comfort temperature modal by sending an undefined value to the behavior subject.
   */
  onCloseComfortTemperatureModal(): void {
    this._comfortTemperatureModal$.next(undefined);
  }

  /**
   * Returns an observable that emits the configuration for the comfort temperature modal.
   * Used in conjunction with an async pipe in the main HTML template to display the modal.
   */
  getComfortTemperatureModalConfig(): Observable<ModalConfig | undefined> {
    return this._comfortTemperatureModal$.asObservable();
  }

  /**
   * Opens the eco temperature modal with the given configuration.
   * @param config The configuration for the modal.
   */
  onOpenEcoTemperatureModal(config: ModalConfig): void {
    this._ecoTemperatureModal$.next(config);
  }

  /**
   * Closes the eco temperature modal by sending an undefined value to the behavior subject.
   */
  onCloseEcoTemperatureModal(): void {
    this._ecoTemperatureModal$.next(undefined);
  }

  /**
   * Returns an observable that emits the configuration for the eco temperature modal.
   * Used in conjunction with an async pipe in the main HTML template to display the modal.
   */
  getEcoTemperatureModalConfig(): Observable<ModalConfig | undefined> {
    return this._ecoTemperatureModal$.asObservable();
  }

  /**
   * Opens the vacancy modal with the given configuration.
   * @param config The configuration for the modal.
   */
  onOpenVacancyModal(config: ModalConfig): void {
    this._vacancyModal$.next(config);
  }

  /**
   * Closes the vacancy modal by sending an undefined value to the behavior subject.
   */
  onCloseVacancyModal(): void {
    this._vacancyModal$.next(undefined);
  }

  /**
   * Returns an observable that emits the configuration for the vacancy modal.
   * Used in conjunction with an async pipe in the main HTML template to display the modal.
   */
  getVacancyModalConfig(): Observable<ModalConfig | undefined> {
    return this._vacancyModal$.asObservable();
  }

  /**
   * Opens the boost modal with the given configuration.
   * @param config The configuration for the modal.
   */
  onOpenBoostModal(config: ModalConfig): void {
    this._boostModal$.next(config);
  }

  /**
   * Closes the boost modal by sending an undefined value to the behavior subject.
   */
  onCloseBoostModal(): void {
    this._boostModal$.next(undefined);
  }

  /**
   * Returns an observable that emits the configuration for the boost modal.
   * Used in conjunction with an async pipe in the main HTML template to display the modal.
   */
  getBoostModalConfig(): Observable<ModalConfig | undefined> {
    return this._boostModal$.asObservable();
  }

  /**
   * Opens the disable motion detection prompt modal with the given configuration.
   * @param config The configuration for the modal.
   */
  onOpenDisableMotionDetectionModal(config: ModalConfig): void {
    this._disableMotionDetectionModal$.next(config);
  }

  /**
   * Closes the disable motion detection prompt modal by sending an undefined value to the behavior subject.
   */
  onCloseDisableMotionDetectionModal(): void {
    this._disableMotionDetectionModal$.next(undefined);
  }

  /**
   * Returns an observable that emits the configuration for the disable motion detection prompt modal.
   * Used in conjunction with an async pipe in the main HTML template to display the modal.
   */
  getDisableMotionDetectionModalConfig(): Observable<ModalConfig | undefined> {
    return this._disableMotionDetectionModal$.asObservable();
  }

  /**
   * Opens the disable boost prompt modal with the given configuration.
   * @param config The configuration for the modal.
   */
  onOpenDisableBoostModal(config: ModalConfig): void {
    this._disableBoostModal$.next(config);
  }

  /**
   * Closes the disable boost prompt modal by sending an undefined value to the behavior subject.
   */
  onCloseDisableBoostModal(): void {
    this._disableBoostModal$.next(undefined);
  }

  /**
   * Returns an observable that emits the configuration for the disable boost prompt modal.
   * Used in conjunction with an async pipe in the main HTML template to display the modal.
   */
  getDisableBoostModalConfig(): Observable<ModalConfig | undefined> {
    return this._disableBoostModal$.asObservable();
  }

  /**
   * Opens the disable vacancy prompt modal with the given configuration.
   * @param config The configuration for the modal.
   */
  onOpenDisableVacancyModal(config: ModalConfig): void {
    this._disableVacancyModal$.next(config);
  }

  /**
   * Closes the disable vacancy prompt modal by sending an undefined value to the behavior subject.
   */
  onCloseDisableVacancyModal(): void {
    this._disableVacancyModal$.next(undefined);
  }

  /**
   * Returns an observable that emits the configuration for the disable vacancy prompt modal.
   * Used in conjunction with an async pipe in the main HTML template to display the modal.
   */
  getDisableVacancyModalConfig(): Observable<ModalConfig | undefined> {
    return this._disableVacancyModal$.asObservable();
  }

  /**
   * Opens the new preset modal with the given configuration.
   * @param config The configuration for the modal.
   */
  onOpenNewPresetModal(config: PresetModalConfig): void {
    this._newPresetModal$.next(config);
  }

  /**
   * Closes the new preset modal by sending an undefined value to the behavior subject.
   */
  onCloseNewPresetModal(): void {
    this._newPresetModal$.next(undefined);
  }

  /**
   * Returns an observable that emits the configuration for the new preset modal.
   * Used in conjunction with an async pipe in the main HTML template to display the modal.
   */
  getNewPresetModalConfig(): Observable<PresetModalConfig | undefined> {
    return this._newPresetModal$.asObservable();
  }

  /**
   * Opens the load preset modal with the given configuration.
   * @param config The configuration for the modal.
   */
  onOpenLoadPresetModal(config: LoadPresetModalConfig): void {
    this._loadPresetModal$.next(config);
  }

  /**
   * Closes the load preset modal by sending an undefined value to the behavior subject.
   */
  onCloseLoadPresetModal(): void {
    this._loadPresetModal$.next(undefined);
  }

  /**
   * Returns an observable that emits the configuration for the load preset modal.
   * Used in conjunction with an async pipe in the main HTML template to display the modal.
   */
  getLoadPresetModalConfig(): Observable<LoadPresetModalConfig | undefined> {
    return this._loadPresetModal$.asObservable();
  }

  /**
   * Opens the copy schedule to days modal with the given configuration.
   * @param config The configuration for the modal.
   */
  onOpenCopyDayScheduleModal(config: CopyDayScheduleModalConfig): void {
    this._copyDayScheduleModal$.next(config);
  }

  /**
   * Closes the copy schedule to days modal by sending an undefined value to the behavior subject.
   */
  onCloseCopyDayScheduleModal(): void {
    this._copyDayScheduleModal$.next(undefined);
  }

  /**
   * Returns an observable that emits the configuration for the copy schedule to days modal.
   * Used in conjunction with an async pipe in the main HTML template to display the modal.
   */
  getCopyDayScheduleModalConfig(): Observable<CopyDayScheduleModalConfig | undefined> {
    return this._copyDayScheduleModal$.asObservable();
  }

  /**
   * Opens the copy schedule to devices modal with the given configuration.
   * @param config The configuration for the modal.
   */
  onOpenCopyToDevicesModal(config: CopyToDevicesModalConfig): void {
    this._copyScheduleToDevicesModal$.next(config);
  }

  /**
   * Closes the copy schedule to devices modal by sending an undefined value to the behavior subject.
   */
  onCloseCopyToDevicesModal(): void {
    this._copyScheduleToDevicesModal$.next(undefined);
  }

  /**
   * Returns an observable that emits the configuration for the copy schedule to devices modal.
   * Used in conjunction with an async pipe in the main HTML template to display the modal.
   */
  getCopyToDevicesModal(): Observable<CopyToDevicesModalConfig | undefined> {
    return this._copyScheduleToDevicesModal$.asObservable();
  }

  /**
   * Opens the delete preset modal with the given configuration.
   * @param config The configuration for the modal.
   */
  onOpenDeletePresetModal(config: ModalConfig): void {
    this._deletePresetModal.next(config);
  }

  /**
   * Closes the delete preset modal by sending an undefined value to the behavior subject.
   */
  onCloseDeletePresetModal(): void {
    this._deletePresetModal.next(undefined);
  }

  /**
   * Returns an observable that emits the configuration for the delete preset modal.
   * Used in conjunction with an async pipe in the main HTML template to display the modal.
   */
  getDeletePresetModal(): Observable<ModalConfig | undefined> {
    return this._deletePresetModal.asObservable();
  }

}
