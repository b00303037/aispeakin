import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { filter, skip, tap } from 'rxjs';
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
export class AppComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService,
    public t: TranslateService
  ) {
    this.authService.loggedIn$
      .pipe(
        skip(1),
        filter((_loggedIn) => !_loggedIn),
        tap(() => {
          this.router.navigate(['/home']);
        })
      )
      .subscribe();

    this.themeService.theme$
      .pipe(
        skip(1),
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

    this.t.use(Lang.ZHTW);
  }
}
