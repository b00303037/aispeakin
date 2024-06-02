import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SubmitReq, SubmitRes } from '../models/feedback/submit.models';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractFeedbackService {
  abstract Submit(req: SubmitReq): Observable<SubmitRes>;
}
