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

        let code = BaseAPICode.DEFAULT_ERROR;
        let message = '很抱歉，發生未預期的錯誤，請稍後再試一次';

        if (err instanceof HttpErrorResponse && err.status === 401) {
          code = BaseAPICode.AUTH_ERROR;
          message = '登入認證已過期，請重新登入';

          // TODO: refresh token

          this.authService.loggedIn$.next(false);
        }

        return throwError(
          (): BaseAPIResModel<null> => ({
            success: false,
            code,
            message,
            content: null,
          })
        );
      })
    );
  }
}
