import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtModule } from '@auth0/angular-jwt';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { Lang } from './shared/enums/lang.enum';
import { tokenGetter } from './shared/services/utils';
import { AuthInterceptor } from './shared/services/auth.interceptor';
import { AbstractXService } from './api/abstract/abstract-x.service';
import { XMockService } from './api-mock/x-mock.service';
import { XService } from './api/x.service';

import { environment } from '../environments/environment';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: AbstractXService,
      useClass: environment.mock ? XMockService : XService,
    },
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter,
          allowedDomains: environment.allowedDomains,
          skipWhenExpired: true,
        },
      })
    ),
    importProvidersFrom([
      TranslateModule.forRoot({
        defaultLanguage: Object.values(Lang).includes(localStorage['lang'])
          ? localStorage['lang']
          : Lang.ZHTW,
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ]),
    provideAnimationsAsync(),
  ],
};
