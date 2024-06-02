import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { AbstractFeedbackService } from './abstract/abstract-feedback.service';
import { BaseApiService } from './base-api.service';
import { SubmitReq, SubmitRes } from './models/feedback/submit.models';
import { BaseAPICode } from '../shared/enums/base-api-code.enum';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService
  extends BaseApiService
  implements AbstractFeedbackService
{
  private baseRoute = '/feedback';

  Submit(req: SubmitReq): Observable<SubmitRes> {
    const apiUri = this.baseRoute + '/submit';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return super
      .post<SubmitReq, SubmitRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
}
