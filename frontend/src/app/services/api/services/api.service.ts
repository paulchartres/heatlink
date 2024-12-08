/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { Device } from '../models/device';
import { deviceDeviceIdBoostPost } from '../fn/operations/device-device-id-boost-post';
import { DeviceDeviceIdBoostPost$Params } from '../fn/operations/device-device-id-boost-post';
import { deviceDeviceIdGet } from '../fn/operations/device-device-id-get';
import { DeviceDeviceIdGet$Params } from '../fn/operations/device-device-id-get';
import { deviceDeviceIdHistoryHumidityPost } from '../fn/operations/device-device-id-history-humidity-post';
import { DeviceDeviceIdHistoryHumidityPost$Params } from '../fn/operations/device-device-id-history-humidity-post';
import { deviceDeviceIdHistoryTemperaturePost } from '../fn/operations/device-device-id-history-temperature-post';
import { DeviceDeviceIdHistoryTemperaturePost$Params } from '../fn/operations/device-device-id-history-temperature-post';
import { deviceDeviceIdLockPost } from '../fn/operations/device-device-id-lock-post';
import { DeviceDeviceIdLockPost$Params } from '../fn/operations/device-device-id-lock-post';
import { deviceDeviceIdModePost } from '../fn/operations/device-device-id-mode-post';
import { DeviceDeviceIdModePost$Params } from '../fn/operations/device-device-id-mode-post';
import { deviceDeviceIdMotionDetectionPost } from '../fn/operations/device-device-id-motion-detection-post';
import { DeviceDeviceIdMotionDetectionPost$Params } from '../fn/operations/device-device-id-motion-detection-post';
import { deviceDeviceIdResetSpecialModePost } from '../fn/operations/device-device-id-reset-special-mode-post';
import { DeviceDeviceIdResetSpecialModePost$Params } from '../fn/operations/device-device-id-reset-special-mode-post';
import { deviceDeviceIdScheduleModePost } from '../fn/operations/device-device-id-schedule-mode-post';
import { DeviceDeviceIdScheduleModePost$Params } from '../fn/operations/device-device-id-schedule-mode-post';
import { deviceDeviceIdSchedulePost } from '../fn/operations/device-device-id-schedule-post';
import { DeviceDeviceIdSchedulePost$Params } from '../fn/operations/device-device-id-schedule-post';
import { deviceDeviceIdTargetComfortPost } from '../fn/operations/device-device-id-target-comfort-post';
import { DeviceDeviceIdTargetComfortPost$Params } from '../fn/operations/device-device-id-target-comfort-post';
import { deviceDeviceIdTargetEcoPost } from '../fn/operations/device-device-id-target-eco-post';
import { DeviceDeviceIdTargetEcoPost$Params } from '../fn/operations/device-device-id-target-eco-post';
import { deviceDeviceIdUnlockPost } from '../fn/operations/device-device-id-unlock-post';
import { DeviceDeviceIdUnlockPost$Params } from '../fn/operations/device-device-id-unlock-post';
import { deviceDeviceIdVacancyPost } from '../fn/operations/device-device-id-vacancy-post';
import { DeviceDeviceIdVacancyPost$Params } from '../fn/operations/device-device-id-vacancy-post';
import { DeviceInfo } from '../models/device-info';
import { DeviceInfoStripped } from '../models/device-info-stripped';
import { devicesGet } from '../fn/operations/devices-get';
import { DevicesGet$Params } from '../fn/operations/devices-get';
import { DeviceStripped } from '../models/device-stripped';
import { HumidityHistory } from '../models/humidity-history';
import { rawDeviceDeviceIdGet } from '../fn/operations/raw-device-device-id-get';
import { RawDeviceDeviceIdGet$Params } from '../fn/operations/raw-device-device-id-get';
import { rawDevicesGet } from '../fn/operations/raw-devices-get';
import { RawDevicesGet$Params } from '../fn/operations/raw-devices-get';
import { TemperatureHistory } from '../models/temperature-history';
import { Weather } from '../models/weather';
import { weatherGet } from '../fn/operations/weather-get';
import { WeatherGet$Params } from '../fn/operations/weather-get';

@Injectable({ providedIn: 'root' })
export class ApiService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `rawDevicesGet()` */
  static readonly RawDevicesGetPath = '/raw/devices';

  /**
   * Retrieves the raw Heazty list of devices associated to your account.
   *
   * Retrieves the full, unaltered list of devices linked to your account. Another endpoint is available with more concise and readable data.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `rawDevicesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  rawDevicesGet$Response(params?: RawDevicesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Device>>> {
    return rawDevicesGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieves the raw Heazty list of devices associated to your account.
   *
   * Retrieves the full, unaltered list of devices linked to your account. Another endpoint is available with more concise and readable data.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `rawDevicesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  rawDevicesGet(params?: RawDevicesGet$Params, context?: HttpContext): Observable<Array<Device>> {
    return this.rawDevicesGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Device>>): Array<Device> => r.body)
    );
  }

  /** Path part for operation `devicesGet()` */
  static readonly DevicesGetPath = '/devices';

  /**
   * Retrieves the stripped and readable list of devices associated to your account.
   *
   * Retrieves the stripped and readable list of devices linked to your account. Another endpoint is available to retrieve unaltered Heatzy data.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `devicesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  devicesGet$Response(params?: DevicesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<DeviceStripped>>> {
    return devicesGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieves the stripped and readable list of devices associated to your account.
   *
   * Retrieves the stripped and readable list of devices linked to your account. Another endpoint is available to retrieve unaltered Heatzy data.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `devicesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  devicesGet(params?: DevicesGet$Params, context?: HttpContext): Observable<Array<DeviceStripped>> {
    return this.devicesGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<DeviceStripped>>): Array<DeviceStripped> => r.body)
    );
  }

  /** Path part for operation `rawDeviceDeviceIdGet()` */
  static readonly RawDeviceDeviceIdGetPath = '/raw/device/{deviceId}';

  /**
   * Retrieves the stripped and readable information relative to a specific device.
   *
   * Retrieves the raw Heatzy information relative to a specific device, using the device's did (device ID). Another endpoint is available to retrieve stripped and readable data. The heating schedule is expressed in readable hours in this payload.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `rawDeviceDeviceIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  rawDeviceDeviceIdGet$Response(params: RawDeviceDeviceIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<DeviceInfo>> {
    return rawDeviceDeviceIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieves the stripped and readable information relative to a specific device.
   *
   * Retrieves the raw Heatzy information relative to a specific device, using the device's did (device ID). Another endpoint is available to retrieve stripped and readable data. The heating schedule is expressed in readable hours in this payload.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `rawDeviceDeviceIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  rawDeviceDeviceIdGet(params: RawDeviceDeviceIdGet$Params, context?: HttpContext): Observable<DeviceInfo> {
    return this.rawDeviceDeviceIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<DeviceInfo>): DeviceInfo => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdGet()` */
  static readonly DeviceDeviceIdGetPath = '/device/{deviceId}';

  /**
   * Retrieves the stripped and readable information relative to a specific device.
   *
   * Retrieves the stripped and readable information relative to a specific device, using the device's did (device ID). Another endpoint is available to retrieve raw data. The heating schedule is expressed in readable hours in this payload.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceDeviceIdGet$Response(params: DeviceDeviceIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<DeviceInfoStripped>> {
    return deviceDeviceIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieves the stripped and readable information relative to a specific device.
   *
   * Retrieves the stripped and readable information relative to a specific device, using the device's did (device ID). Another endpoint is available to retrieve raw data. The heating schedule is expressed in readable hours in this payload.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceDeviceIdGet(params: DeviceDeviceIdGet$Params, context?: HttpContext): Observable<DeviceInfoStripped> {
    return this.deviceDeviceIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<DeviceInfoStripped>): DeviceInfoStripped => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdHistoryTemperaturePost()` */
  static readonly DeviceDeviceIdHistoryTemperaturePostPath = '/device/{deviceId}/history/temperature';

  /**
   * Retrieves the temperature history of a device in a requested interval.
   *
   * Retrieves the temperature history of a device in a requested interval. The start and end values should be specified as timestamps (seconds).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdHistoryTemperaturePost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdHistoryTemperaturePost$Response(params: DeviceDeviceIdHistoryTemperaturePost$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<TemperatureHistory>>> {
    return deviceDeviceIdHistoryTemperaturePost(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieves the temperature history of a device in a requested interval.
   *
   * Retrieves the temperature history of a device in a requested interval. The start and end values should be specified as timestamps (seconds).
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdHistoryTemperaturePost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdHistoryTemperaturePost(params: DeviceDeviceIdHistoryTemperaturePost$Params, context?: HttpContext): Observable<Array<TemperatureHistory>> {
    return this.deviceDeviceIdHistoryTemperaturePost$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<TemperatureHistory>>): Array<TemperatureHistory> => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdHistoryHumidityPost()` */
  static readonly DeviceDeviceIdHistoryHumidityPostPath = '/device/{deviceId}/history/humidity';

  /**
   * Retrieves the humidity history of a device in a requested interval.
   *
   * Retrieves the humidity history of a device in a requested interval. The start and end values should be specified as timestamps (seconds).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdHistoryHumidityPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdHistoryHumidityPost$Response(params: DeviceDeviceIdHistoryHumidityPost$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<HumidityHistory>>> {
    return deviceDeviceIdHistoryHumidityPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieves the humidity history of a device in a requested interval.
   *
   * Retrieves the humidity history of a device in a requested interval. The start and end values should be specified as timestamps (seconds).
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdHistoryHumidityPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdHistoryHumidityPost(params: DeviceDeviceIdHistoryHumidityPost$Params, context?: HttpContext): Observable<Array<HumidityHistory>> {
    return this.deviceDeviceIdHistoryHumidityPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<HumidityHistory>>): Array<HumidityHistory> => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdModePost()` */
  static readonly DeviceDeviceIdModePostPath = '/device/{deviceId}/mode';

  /**
   * Changes the current heating mode of a specific device.
   *
   * Changes the current heating mode of a specific device.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdModePost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdModePost$Response(params: DeviceDeviceIdModePost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deviceDeviceIdModePost(this.http, this.rootUrl, params, context);
  }

  /**
   * Changes the current heating mode of a specific device.
   *
   * Changes the current heating mode of a specific device.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdModePost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdModePost(params: DeviceDeviceIdModePost$Params, context?: HttpContext): Observable<void> {
    return this.deviceDeviceIdModePost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdTargetComfortPost()` */
  static readonly DeviceDeviceIdTargetComfortPostPath = '/device/{deviceId}/target/comfort';

  /**
   * Changes the target comfort temperature of a specific device.
   *
   * Changes the target comfort temperature of a specific device.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdTargetComfortPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdTargetComfortPost$Response(params: DeviceDeviceIdTargetComfortPost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deviceDeviceIdTargetComfortPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Changes the target comfort temperature of a specific device.
   *
   * Changes the target comfort temperature of a specific device.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdTargetComfortPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdTargetComfortPost(params: DeviceDeviceIdTargetComfortPost$Params, context?: HttpContext): Observable<void> {
    return this.deviceDeviceIdTargetComfortPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdTargetEcoPost()` */
  static readonly DeviceDeviceIdTargetEcoPostPath = '/device/{deviceId}/target/eco';

  /**
   * Changes the target eco temperature of a specific device.
   *
   * Changes the target eco temperature of a specific device.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdTargetEcoPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdTargetEcoPost$Response(params: DeviceDeviceIdTargetEcoPost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deviceDeviceIdTargetEcoPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Changes the target eco temperature of a specific device.
   *
   * Changes the target eco temperature of a specific device.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdTargetEcoPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdTargetEcoPost(params: DeviceDeviceIdTargetEcoPost$Params, context?: HttpContext): Observable<void> {
    return this.deviceDeviceIdTargetEcoPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdVacancyPost()` */
  static readonly DeviceDeviceIdVacancyPostPath = '/device/{deviceId}/vacancy';

  /**
   * Enables vacancy mode for a specific device.
   *
   * Enables vacancy mode for a specific device, for a certain amount of time (in days).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdVacancyPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdVacancyPost$Response(params: DeviceDeviceIdVacancyPost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deviceDeviceIdVacancyPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Enables vacancy mode for a specific device.
   *
   * Enables vacancy mode for a specific device, for a certain amount of time (in days).
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdVacancyPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdVacancyPost(params: DeviceDeviceIdVacancyPost$Params, context?: HttpContext): Observable<void> {
    return this.deviceDeviceIdVacancyPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdBoostPost()` */
  static readonly DeviceDeviceIdBoostPostPath = '/device/{deviceId}/boost';

  /**
   * Enables boost mode for a specific device.
   *
   * Enables boost mode for a specific device, for a certain amount of time (in minutes).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdBoostPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdBoostPost$Response(params: DeviceDeviceIdBoostPost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deviceDeviceIdBoostPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Enables boost mode for a specific device.
   *
   * Enables boost mode for a specific device, for a certain amount of time (in minutes).
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdBoostPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdBoostPost(params: DeviceDeviceIdBoostPost$Params, context?: HttpContext): Observable<void> {
    return this.deviceDeviceIdBoostPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdLockPost()` */
  static readonly DeviceDeviceIdLockPostPath = '/device/{deviceId}/lock';

  /**
   * Locks the physical interface of a specific device.
   *
   * Locks the physical interface of a specific device. This doesn't affect the device in the dashboard.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdLockPost()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceDeviceIdLockPost$Response(params: DeviceDeviceIdLockPost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deviceDeviceIdLockPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Locks the physical interface of a specific device.
   *
   * Locks the physical interface of a specific device. This doesn't affect the device in the dashboard.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdLockPost$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceDeviceIdLockPost(params: DeviceDeviceIdLockPost$Params, context?: HttpContext): Observable<void> {
    return this.deviceDeviceIdLockPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdUnlockPost()` */
  static readonly DeviceDeviceIdUnlockPostPath = '/device/{deviceId}/unlock';

  /**
   * Unlocks the physical interface of a specific device.
   *
   * Unlocks the physical interface of a specific device. This doesn't affect the device in the dashboard.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdUnlockPost()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceDeviceIdUnlockPost$Response(params: DeviceDeviceIdUnlockPost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deviceDeviceIdUnlockPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Unlocks the physical interface of a specific device.
   *
   * Unlocks the physical interface of a specific device. This doesn't affect the device in the dashboard.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdUnlockPost$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceDeviceIdUnlockPost(params: DeviceDeviceIdUnlockPost$Params, context?: HttpContext): Observable<void> {
    return this.deviceDeviceIdUnlockPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdMotionDetectionPost()` */
  static readonly DeviceDeviceIdMotionDetectionPostPath = '/device/{deviceId}/motion-detection';

  /**
   * Enables motion detection mode for a specific device.
   *
   * Enables motion detection mode for a specific device.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdMotionDetectionPost()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceDeviceIdMotionDetectionPost$Response(params: DeviceDeviceIdMotionDetectionPost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deviceDeviceIdMotionDetectionPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Enables motion detection mode for a specific device.
   *
   * Enables motion detection mode for a specific device.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdMotionDetectionPost$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceDeviceIdMotionDetectionPost(params: DeviceDeviceIdMotionDetectionPost$Params, context?: HttpContext): Observable<void> {
    return this.deviceDeviceIdMotionDetectionPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdResetSpecialModePost()` */
  static readonly DeviceDeviceIdResetSpecialModePostPath = '/device/{deviceId}/reset-special-mode';

  /**
   * Disables any kind of special mode for a specific device.
   *
   * Disables any kind of special mode for a specific device. Includes motion detection, boost or vacancy.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdResetSpecialModePost()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceDeviceIdResetSpecialModePost$Response(params: DeviceDeviceIdResetSpecialModePost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deviceDeviceIdResetSpecialModePost(this.http, this.rootUrl, params, context);
  }

  /**
   * Disables any kind of special mode for a specific device.
   *
   * Disables any kind of special mode for a specific device. Includes motion detection, boost or vacancy.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdResetSpecialModePost$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceDeviceIdResetSpecialModePost(params: DeviceDeviceIdResetSpecialModePost$Params, context?: HttpContext): Observable<void> {
    return this.deviceDeviceIdResetSpecialModePost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdSchedulePost()` */
  static readonly DeviceDeviceIdSchedulePostPath = '/device/{deviceId}/schedule';

  /**
   * Updates the heating schedule of a specific device.
   *
   * Updates the heating schedule of a specific device.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdSchedulePost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdSchedulePost$Response(params: DeviceDeviceIdSchedulePost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deviceDeviceIdSchedulePost(this.http, this.rootUrl, params, context);
  }

  /**
   * Updates the heating schedule of a specific device.
   *
   * Updates the heating schedule of a specific device.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdSchedulePost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdSchedulePost(params: DeviceDeviceIdSchedulePost$Params, context?: HttpContext): Observable<void> {
    return this.deviceDeviceIdSchedulePost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `deviceDeviceIdScheduleModePost()` */
  static readonly DeviceDeviceIdScheduleModePostPath = '/device/{deviceId}/schedule-mode';

  /**
   * Sets the schedule mode of a specific device.
   *
   * Sets the schedule mode of a specific device.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdScheduleModePost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdScheduleModePost$Response(params: DeviceDeviceIdScheduleModePost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deviceDeviceIdScheduleModePost(this.http, this.rootUrl, params, context);
  }

  /**
   * Sets the schedule mode of a specific device.
   *
   * Sets the schedule mode of a specific device.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdScheduleModePost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deviceDeviceIdScheduleModePost(params: DeviceDeviceIdScheduleModePost$Params, context?: HttpContext): Observable<void> {
    return this.deviceDeviceIdScheduleModePost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `weatherGet()` */
  static readonly WeatherGetPath = '/weather';

  /**
   * Retrieves the current external temperature at the location set in the environment variables.
   *
   * Retrieves the current external temperature at the location set in the environment variables. If no variables are set, returns an error code in order not to display the values in the webapp.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `weatherGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  weatherGet$Response(params?: WeatherGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Weather>> {
    return weatherGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieves the current external temperature at the location set in the environment variables.
   *
   * Retrieves the current external temperature at the location set in the environment variables. If no variables are set, returns an error code in order not to display the values in the webapp.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `weatherGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  weatherGet(params?: WeatherGet$Params, context?: HttpContext): Observable<Weather> {
    return this.weatherGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Weather>): Weather => r.body)
    );
  }

}
