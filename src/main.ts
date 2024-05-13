import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { onThemeChange } from './app/shared/services/utils';

window.matchMedia('(prefers-color-scheme: dark)').onchange = onThemeChange;

onThemeChange();

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
