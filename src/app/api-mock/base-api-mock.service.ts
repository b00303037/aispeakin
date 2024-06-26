import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, of, Observable, catchError } from 'rxjs';

import { BaseAPIResModel } from '../api/models/base-api.models';
import { BaseAPICode } from '../shared/enums/base-api-code.enum';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseApiMockService {
  protected baseApiUrl = environment.baseApiUrl;

  private defaultError: BaseAPIResModel<null> = {
    code: BaseAPICode.InternalServerError,
    msg: '',
    msg_key: 'api.error',
    data: null,
  };

  protected latencyMS = 300;

  constructor(protected http: HttpClient) {}

  protected get<TRes>(uri: string, params?: HttpParams): Observable<TRes> {
    const url = this.baseApiUrl + uri;
    const options = {
      params,
    };

    return this.http
      .request<TRes>('get', url, options)
      .pipe(catchError((err) => throwError(() => err || this.defaultError)));
  }

  protected post<TReq, TRes>(
    apiUri: string,
    body: TReq,
    params?: HttpParams
  ): Observable<TRes> {
    const url = this.baseApiUrl + apiUri;
    const options = {
      body,
      params,
    };

    return this.http
      .request<TRes>('post', url, options)
      .pipe(catchError((err) => throwError(() => err || this.defaultError)));
  }

  protected throwNotIn<T>(codes: Array<BaseAPICode>, res: BaseAPIResModel<T>) {
    const { code, msg_key } = res;

    if (!codes.includes(code)) {
      return throwError(() => ({ code, msg_key }));
    }
    return of(res);
  }
}
