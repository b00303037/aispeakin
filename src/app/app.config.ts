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
import { tokenGetter } from './shared/services/utils';
import { AuthInterceptor } from './shared/services/auth.interceptor';
import { AbstractFeedbackService } from './api/abstract/abstract-feedback.service';
import { AbstractStreamServerService } from './api/abstract/abstract-stream-server.service';
import { AbstractUserService } from './api/abstract/abstract-user.service';
import { FeedbackMockService } from './api-mock/feedback-mock.service';
import { StreamServerMockService } from './api-mock/stream-server-mock.service';
import { UserMockService } from './api-mock/user-mock.service';
import { FeedbackService } from './api/feedback.service';
import { StreamServerService } from './api/stream-server.service';
import { UserService } from './api/user.service';

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
      provide: AbstractFeedbackService,
      useClass: environment.mock ? FeedbackMockService : FeedbackService,
    },
    {
      provide: AbstractStreamServerService,
      useClass: environment.mock
        ? StreamServerMockService
        : StreamServerService,
    },
    {
      provide: AbstractUserService,
      useClass: environment.mock ? UserMockService : UserService,
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
