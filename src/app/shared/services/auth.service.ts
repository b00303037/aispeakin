import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

import { tokenGetter } from './utils';
import { Payload } from '../../api/models/jwt.models';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  payload$ = new BehaviorSubject<Payload | undefined>(undefined);

  loggedIn$ = new BehaviorSubject<boolean>(this.validateToken());

  logging = false;

  constructor(private jwtHelperService: JwtHelperService) {}

  get token(): string | null {
    return tokenGetter();
  }
  set token(token) {
    token !== null
      ? localStorage.setItem(environment.tokenKey, token)
      : localStorage.removeItem(environment.tokenKey);
  }

  validateToken(): boolean {
    const token = this.token;

    if (typeof token !== 'string') {
      return false;
    }

    try {
      const payload = this.jwtHelperService.decodeToken(token) as Payload;

      if (this.jwtHelperService.isTokenExpired(token)) {
        return false;
      }

      this.payload$.next(payload);
    } catch (err) {
      console.error(err);

      this.token = null;

      return false;
    }

    return true;
  }

  logout(): void {
    this.token = null;

    this.payload$.next(undefined);
    this.loggedIn$.next(false);
  }
}
