import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AbstractXService } from '../../api/abstract/abstract-x.service';

export const APIKeyResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(AbstractXService)
    .XGetAPIKey({})
    .pipe(
      map((res) => res.content),
      catchError((err) => of(''))
    );
};
