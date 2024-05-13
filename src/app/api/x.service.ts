import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { AbstractXService } from './abstract/abstract-x.service';
import { BaseApiService } from './base-api.service';
import { XGetAPIKeyReq, XGetAPIKeyRes } from './models/x/x-get-api-key.models';
import { XLoginReq, XLoginRes } from './models/x/x-login.models';
import { BaseAPICode } from '../shared/enums/base-api-code.enum';

@Injectable({
  providedIn: 'root',
})
export class XService extends BaseApiService implements AbstractXService {
  private baseRoute = '/X';

  XLogin(req: XLoginReq): Observable<XLoginRes> {
    const apiUri = this.baseRoute + '/XLogin';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.SUCCESS];

    return super
      .post<XLoginReq, XLoginRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }

  XGetAPIKey(req: XGetAPIKeyReq): Observable<XGetAPIKeyRes> {
    const apiUri = this.baseRoute + '/XGetAPIKey';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.SUCCESS];

    return super
      .post<XGetAPIKeyReq, XGetAPIKeyRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
}
