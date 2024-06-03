import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Theme } from '../enums/theme.enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme$: BehaviorSubject<Theme | undefined>;

  constructor() {
    const theme = localStorage.getItem('theme');
    let _theme: Theme | undefined;

    switch (theme) {
      case 'light':
        _theme = Theme.Light;
        break;
      case 'dark':
        _theme = Theme.Dark;
        break;
      default:
        _theme = undefined;
    }

    this.theme$ = new BehaviorSubject(_theme);
  }
}
