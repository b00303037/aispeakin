import { Injectable } from '@angular/core';
import { map, Observable, switchMap, timer } from 'rxjs';

import { BaseApiMockService } from './base-api-mock.service';
import { TOKENS } from './data/token.data';
import { AbstractXService } from '../api/abstract/abstract-x.service';
import {
  XGetAPIKeyReq,
  XGetAPIKeyRes,
} from '../api/models/x/x-get-api-key.models';
import { XLoginReq, XLoginRes } from '../api/models/x/x-login.models';
import { BaseAPICode } from '../shared/enums/base-api-code.enum';

@Injectable({
  providedIn: 'root',
})
export class XMockService
  extends BaseApiMockService
  implements AbstractXService
{
  private baseRoute = '/X';

  getVideoUri = this.baseApiUrl + this.baseRoute + '/GetVideo';
  downloadVideoUri = this.baseApiUrl + this.baseRoute + '/DownloadVideo';

  /* MOCK API */
  XGetAPIKey(req: XGetAPIKeyReq): Observable<XGetAPIKeyRes> {
    let content = '';

    console.log('---');
    console.log('XGetAPIKey');
    console.log(req);
    console.log(content);

    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.SUCCESS];

    return timer(this.latencyMS).pipe(
      map(() => ({
        success: true,
        code: BaseAPICode.SUCCESS,
        message: '成功取得 API Key',
        content,
      })),
      switchMap((res) => super.throwNotIn(acceptedCodes, res))
    );
  }

  /* MOCK API */
  XLogin(req: XLoginReq): Observable<XLoginRes> {
    const { accessToken, expiredAccessToken, refreshToken } = TOKENS;

    const content = {
      accessToken,
      refreshToken,
      expiresIn: 0,
    };

    console.log('---');
    console.log('XLogin');
    console.log(req);
    console.log(content);

    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.SUCCESS];

    return timer(this.latencyMS).pipe(
      map(() => ({
        success: true,
        code: BaseAPICode.SUCCESS,
        message: '成功登入',
        content,
      })),
      switchMap((res) => super.throwNotIn(acceptedCodes, res))
    );
  }
}
