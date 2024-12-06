/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { HeatingMode } from '../../models/heating-mode';

export interface DeviceDeviceIdModePost$Params {

/**
 * The ID of the device whose mode should be changed
 */
  deviceId: string;
      body: {
'mode'?: HeatingMode;
}
}

export function deviceDeviceIdModePost(http: HttpClient, rootUrl: string, params: DeviceDeviceIdModePost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, deviceDeviceIdModePost.PATH, 'post');
  if (params) {
    rb.path('deviceId', params.deviceId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'text', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

deviceDeviceIdModePost.PATH = '/device/{deviceId}/mode';
