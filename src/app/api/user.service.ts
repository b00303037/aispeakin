import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { AbstractUserService } from './abstract/abstract-user.service';
import { BaseApiService } from './base-api.service';
import { LoginReq, LoginRes } from './models/user/login.models';
import { RegisterReq, RegisterRes } from './models/user/register.models';
import { BaseAPICode } from '../shared/enums/base-api-code.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseApiService implements AbstractUserService {
  private baseRoute = '/user';

  Register(req: RegisterReq): Observable<RegisterRes> {
    const apiUri = this.baseRoute + '/register';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return super
      .post<RegisterReq, RegisterRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }

  Login(req: LoginReq): Observable<LoginRes> {
    const apiUri = this.baseRoute + '/login';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return super
      .post<LoginReq, LoginRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
}
