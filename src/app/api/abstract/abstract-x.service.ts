import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  XAddUserFeedbackReq,
  XAddUserFeedbackRes,
} from '../models/x/x-add-user-feedback.models';
import { XGetAPIKeyReq, XGetAPIKeyRes } from '../models/x/x-get-api-key.models';
import { XRegisterReq, XRegisterRes } from '../models/x/x-register.models';
import { XLoginReq, XLoginRes } from '../models/x/x-login.models';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractXService {
  abstract XRegister(req: XRegisterReq): Observable<XRegisterRes>;

  abstract XAddUserFeedback(
    req: XAddUserFeedbackReq
  ): Observable<XAddUserFeedbackRes>;

  abstract XLogin(req: XLoginReq): Observable<XLoginRes>;

  abstract XGetAPIKey(req: XGetAPIKeyReq): Observable<XGetAPIKeyRes>;
}
