import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { XLoginReq, XLoginRes } from '../models/x/x-login.models';
import { XGetAPIKeyReq, XGetAPIKeyRes } from '../models/x/x-get-api-key.models';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractXService {
  abstract XLogin(req: XLoginReq): Observable<XLoginRes>;

  abstract XGetAPIKey(req: XGetAPIKeyReq): Observable<XGetAPIKeyRes>;
}
