import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AbstractStreamServerService } from '../../api/abstract/abstract-stream-server.service';

export const APIKeyResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(AbstractStreamServerService)
    .GetAPIKey()
    .pipe(
      map((res) => res.data),
      catchError((err) => of(''))
    );
};
