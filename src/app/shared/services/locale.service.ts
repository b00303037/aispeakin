import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Locale } from 'date-fns';
import { enUS, ja, zhTW } from 'date-fns/locale';
import { BehaviorSubject, map, tap } from 'rxjs';

import { Lang } from '../enums/lang.enum';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  locale$ = new BehaviorSubject<Locale | undefined>(undefined);

  constructor(private t: TranslateService) {
    this.t.onLangChange
      .pipe(
        map((e) => e.lang),
        tap((lang) => this.handleLangChange(lang))
      )
      .subscribe();
  }

  handleLangChange(lang: string): void {
    let _locale: Locale;

    switch (lang) {
      case Lang.EN:
        _locale = enUS;
        break;
      case Lang.JA:
        _locale = ja;
        break;
      default:
        _locale = zhTW;
    }

    this.locale$.next(_locale);
  }
}
