import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { BaseAPICode } from '../enums/base-api-code.enum';
import { BaseAPIResModel } from '../../api/models/base-api.models';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<BaseAPIResModel<unknown>>,
    next: HttpHandler
  ): Observable<HttpEvent<BaseAPIResModel<unknown>>> {
    return next.handle(request).pipe(
      catchError((err) => {
        console.error(err);

        let code = BaseAPICode.InternalServerError;
        let msg_key = 'api.error';

        if (err instanceof HttpErrorResponse && err.status === 403) {
          code = BaseAPICode.Forbidden;
          msg_key = 'api.expiration';

          this.authService.loggedIn$.next(false);
        }

        return throwError(
          (): BaseAPIResModel<null> => ({
            code,
            msg: '',
            msg_key,
            data: null,
          })
        );
      })
    );
  }
}
