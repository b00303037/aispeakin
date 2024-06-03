import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AddLogReq, AddLogRes } from '../models/stream-server/add-log.models';
import { GetAPIKeyRes } from '../models/stream-server/get-api-key.models';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractStreamServerService {
  abstract AddLog(req: AddLogReq): Observable<AddLogRes>;

  abstract GetAPIKey(): Observable<GetAPIKeyRes>;
}
