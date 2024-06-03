import { Injectable } from '@angular/core';
import { map, Observable, switchMap, timer } from 'rxjs';

import { BaseApiMockService } from './base-api-mock.service';
import { AbstractStreamServerService } from '../api/abstract/abstract-stream-server.service';
import {
  AddLogReq,
  AddLogRes,
} from '../api/models/stream-server/add-log.models';
import { GetAPIKeyRes } from '../api/models/stream-server/get-api-key.models';
import { BaseAPICode } from '../shared/enums/base-api-code.enum';

@Injectable({
  providedIn: 'root',
})
export class StreamServerMockService
  extends BaseApiMockService
  implements AbstractStreamServerService
{
  /* MOCK API */
  AddLog(req: AddLogReq): Observable<AddLogRes> {
    const data = null;

    console.log('---');
    console.log('AddLog');
    console.log(req);
    console.log(data);

    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return timer(this.latencyMS).pipe(
      map(() => ({
        code: BaseAPICode.OK,
        msg: '',
        msg_key: '',
        data,
      })),
      switchMap((res) => super.throwNotIn(acceptedCodes, res))
    );
  }

  /* MOCK API */
  GetAPIKey(): Observable<GetAPIKeyRes> {
    let data: string = '';

    console.log('---');
    console.log('GetAPIKey');
    console.log(data);

    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return timer(this.latencyMS).pipe(
      map(() => ({
        code: BaseAPICode.OK,
        msg: '',
        msg_key: '',
        data,
      })),
      switchMap((res) => super.throwNotIn(acceptedCodes, res))
    );
  }
}
