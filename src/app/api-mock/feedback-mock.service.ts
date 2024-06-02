import { Injectable } from '@angular/core';
import { map, Observable, switchMap, timer } from 'rxjs';

import { BaseApiMockService } from './base-api-mock.service';
import { AbstractFeedbackService } from '../api/abstract/abstract-feedback.service';
import { SubmitReq, SubmitRes } from '../api/models/feedback/submit.models';
import { BaseAPICode } from '../shared/enums/base-api-code.enum';

@Injectable({
  providedIn: 'root',
})
export class FeedbackMockService
  extends BaseApiMockService
  implements AbstractFeedbackService
{
  /* MOCK API */
  Submit(req: SubmitReq): Observable<SubmitRes> {
    const data = null;

    console.log('---');
    console.log('Submit');
    console.log(req);
    console.log(data);

    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return timer(this.latencyMS).pipe(
      map(() => ({
        code: BaseAPICode.OK,
        msg: '',
        msg_key: 'API.ADD_USER_FEEDBACK.SUCCESS',
        data,
      })),
      switchMap((res) => super.throwNotIn(acceptedCodes, res))
    );
  }
}
