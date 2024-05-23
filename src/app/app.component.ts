import { Component, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  Subject,
  distinctUntilChanged,
  filter,
  skip,
  takeUntil,
  tap,
} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { Lang } from './shared/enums/lang.enum';
import { AuthService } from './shared/services/auth.service';
import { ThemeService } from './shared/services/theme.service';
import { onThemeChange } from './shared/services/utils';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  private destroy$ = new Subject<null>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService,
    public t: TranslateService
  ) {
    this.authService.loggedIn$
      .pipe(
        takeUntil(this.destroy$),
        skip(1),
        distinctUntilChanged(),
        filter((_loggedIn) => !_loggedIn),
        tap(() => {
          this.router.navigate(['/home']);
        })
      )
      .subscribe();

    this.themeService.theme$
      .pipe(
        takeUntil(this.destroy$),
        skip(1),
        distinctUntilChanged(),
        tap((_theme) => {
          if (_theme !== undefined) {
            localStorage['theme'] = _theme;
          } else {
            localStorage.removeItem('theme');
          }

          onThemeChange();
        })
      )
      .subscribe();

    this.t.onLangChange
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        tap((e) => {
          localStorage['lang'] = e.lang;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
