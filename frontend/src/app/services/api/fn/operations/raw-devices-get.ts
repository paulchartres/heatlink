/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Device } from '../../models/device';

export interface RawDevicesGet$Params {
}

export function rawDevicesGet(http: HttpClient, rootUrl: string, params?: RawDevicesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Device>>> {
  const rb = new RequestBuilder(rootUrl, rawDevicesGet.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<Device>>;
    })
  );
}

rawDevicesGet.PATH = '/raw/devices';
