import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { AsyncPipe, NgClass, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// @angular/materia
import { MediaMatcher } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { LANG_OPTION_LIST, Lang } from '../../enums/lang.enum';
import { Theme } from '../../enums/theme.enum';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    AsyncPipe,
    RouterLink,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnDestroy {
  private _SMQueryListener = () => this.changeDetectorRef.detectChanges();

  SMQuery: MediaQueryList = this.media.matchMedia('(min-width: 600px)');

  theme$ = this.themeService.theme$.asObservable();
  loggedIn$ = this.authService.loggedIn$;

  themeMenuItemList = [
    {
      label: 'THEME.LIGHT',
      value: Theme.Light,
      icon: 'light_mode',
    },
    {
      label: 'THEME.DARK',
      value: Theme.Dark,
      icon: 'dark_mode',
    },
    {
      label: 'THEME.SYSTEM',
      value: undefined,
      icon: 'settings',
    },
  ];
  langOptionList = LANG_OPTION_LIST;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private authService: AuthService,
    private themeService: ThemeService,
    public t: TranslateService
  ) {
    this.SMQuery.addEventListener('change', this._SMQueryListener);
  }

  onSelectTheme(theme?: Theme): void {
    this.themeService.theme$.next(theme);
  }

  onSelectLang(lang: Lang): void {
    this.t.use(lang);

    document.documentElement.setAttribute('lang', lang);
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.SMQuery.removeEventListener('change', this._SMQueryListener);
  }
}
