import { Injectable } from '@angular/core';
import { map, Observable, switchMap, timer } from 'rxjs';

import { BaseApiMockService } from './base-api-mock.service';
import { TOKENS } from './data/token.data';
import { AbstractXService } from '../api/abstract/abstract-x.service';
import { XAddUserFeedbackReq, XAddUserFeedbackRes } from '../api/models/x/x-add-user-feedback.models';
import {
  XGetAPIKeyReq,
  XGetAPIKeyRes,
} from '../api/models/x/x-get-api-key.models';
import { XLoginReq, XLoginRes } from '../api/models/x/x-login.models';
import { XRegisterReq, XRegisterRes } from '../api/models/x/x-register.models';
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
  XAddUserFeedback(req: XAddUserFeedbackReq): Observable<XAddUserFeedbackRes> {

    const content = null;

    console.log('---');
    console.log('XAddUserFeedback');
    console.log(req);
    console.log(content);

    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.SUCCESS];

    return timer(this.latencyMS).pipe(
      map(() => ({
        success: true,
        code: BaseAPICode.SUCCESS,
        message: 'API.ADD_USER_FEEDBACK.SUCCESS',
        content,
      })),
      switchMap((res) => super.throwNotIn(acceptedCodes, res))
    );
  }

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
        message: '取得 API Key 成功',
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
        message: 'API.LOGIN.SUCCESS',
        content,
      })),
      switchMap((res) => super.throwNotIn(acceptedCodes, res))
    );
  }

  /* MOCK API */
  XRegister(req: XRegisterReq): Observable<XRegisterRes> {
    const content = null;

    console.log('---');
    console.log('XRegister');
    console.log(req);
    console.log(content);

    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.SUCCESS];

    return timer(this.latencyMS).pipe(
      map(() => ({
        success: true,
        code: BaseAPICode.SUCCESS,
        message: 'API.REGISTER.SUCCESS',
        content,
      })),
      switchMap((res) => super.throwNotIn(acceptedCodes, res))
    );
  }
}
