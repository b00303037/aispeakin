import { Routes } from '@angular/router';

// pages
import { SttStreamingComponent } from './pages/ubestream/stt-streaming/stt-streaming.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';

import { authGuard } from './shared/guards/auth.guard';
import { APIKeyResolver } from './shared/resolvers/api-key.resolver';

export const routes: Routes = [
  {
    path: 'ubestream',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 's6/stt-streaming',
        component: SttStreamingComponent,
        resolve: {
          APIKey: APIKeyResolver,
        },
      },
      {
        path: 's7/stt-streaming',
        component: SttStreamingComponent,
        resolve: {
          APIKey: APIKeyResolver,
        },
      },
      {
        path: 'stt-streaming',
        component: SttStreamingComponent,
        resolve: {
          APIKey: APIKeyResolver,
        },
      },
      {
        path: '**',
        redirectTo: 'stt-streaming',
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
