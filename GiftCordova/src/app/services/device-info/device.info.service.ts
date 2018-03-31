import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { AccountService } from '../../auth/shared/account.service';
import { HttpResponseSuccessModel, HttpResponseErrorModel } from './../../interceptors/http.model';
import { InterceptedHttp } from '../../interceptors/http.interceptor';
import { DeviceInfoModel } from './device.info.model';
import { TranslateService } from '@ngx-translate/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/fromPromise';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DeviceInfoService {
  constructor(
    private accountService: AccountService,
    private translate: TranslateService,
    private http: InterceptedHttp
  ) {

  }

  public RegisterDevice(registerationId: string, mobilePlatformType: string, version: string): Observable<boolean> {
    let body: DeviceInfoModel = new DeviceInfoModel(null, registerationId, mobilePlatformType, version);

    return this.http.authorizedPost("api/DeviceInfo/RegisterDevice", JSON.stringify(body), null).map(res => {
      let registrationResponse: HttpResponseSuccessModel = res.json();
      return registrationResponse.content;
    });
  }
}
