import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { AbstractStreamServerService } from './abstract/abstract-stream-server.service';
import { BaseApiService } from './base-api.service';
import { AddLogReq, AddLogRes } from './models/stream-server/add-log.models';
import { GetAPIKeyRes } from './models/stream-server/get-api-key.models';
import { BaseAPICode } from '../shared/enums/base-api-code.enum';

@Injectable({
  providedIn: 'root',
})
export class StreamServerService
  extends BaseApiService
  implements AbstractStreamServerService
{
  private baseRoute = '/stream_server';

  AddLog(req: AddLogReq): Observable<AddLogRes> {
    const apiUri = this.baseRoute + '/addLog';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return super
      .post<AddLogReq, AddLogRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }

  GetAPIKey(): Observable<GetAPIKeyRes> {
    const apiUri = this.baseRoute + '/getAPIKey';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return super
      .get<GetAPIKeyRes>(apiUri)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
}
