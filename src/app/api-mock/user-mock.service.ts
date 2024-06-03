import { Injectable } from '@angular/core';
import { map, Observable, switchMap, timer } from 'rxjs';

import { BaseApiMockService } from './base-api-mock.service';
import { TOKENS } from './data/token.data';
import { AbstractUserService } from '../api/abstract/abstract-user.service';
import { LoginReq, LoginRes } from '../api/models/user/login.models';
import { RegisterReq, RegisterRes } from '../api/models/user/register.models';
import { BaseAPICode } from '../shared/enums/base-api-code.enum';

@Injectable({
  providedIn: 'root',
})
export class UserMockService
  extends BaseApiMockService
  implements AbstractUserService
{
  /* MOCK API */
  Register(req: RegisterReq): Observable<RegisterRes> {
    const data = null;

    console.log('---');
    console.log('Register');
    console.log(req);
    console.log(data);

    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return timer(this.latencyMS).pipe(
      map(() => ({
        code: BaseAPICode.OK,
        msg: '',
        msg_key: 'api.register.success',
        data,
      })),
      switchMap((res) => super.throwNotIn(acceptedCodes, res))
    );
  }

  /* MOCK API */
  Login(req: LoginReq): Observable<LoginRes> {
    const { token, expiredToken } = TOKENS;

    const data = { token };

    console.log('---');
    console.log('Login');
    console.log(req);
    console.log(data);

    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return timer(this.latencyMS).pipe(
      map(() => ({
        code: BaseAPICode.OK,
        msg: '',
        msg_key: 'api.login.success',
        data,
      })),
      switchMap((res) => super.throwNotIn(acceptedCodes, res))
    );
  }
}
