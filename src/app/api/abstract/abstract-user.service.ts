import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginReq, LoginRes } from '../models/user/login.models';
import { RegisterReq, RegisterRes } from '../models/user/register.models';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractUserService {
  abstract Register(req: RegisterReq): Observable<RegisterRes>;

  abstract Login(req: LoginReq): Observable<LoginRes>;
}
