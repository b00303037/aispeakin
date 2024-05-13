import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

// @angular/materia
import { MediaMatcher } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';

import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    RouterLink,
    TranslateModule,
    MatButtonModule,
    HeaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy {
  private destroy$ = new Subject<null>();
  private _SMQueryListener = () => this.changeDetectorRef.detectChanges();
  private _MDQueryListener = () => this.changeDetectorRef.detectChanges();

  SMQuery: MediaQueryList = this.media.matchMedia('(min-width: 600px)');
  MDQuery: MediaQueryList = this.media.matchMedia('(min-width: 960px)');

  serviceList: Array<{
    prefix: string;
    featureList: Array<string>;
    imgSrc: string;
  }> = [
    {
      prefix: 'HOME.SERVICE_0.',
      featureList: ['FEATURE_1', 'FEATURE_2'],
      imgSrc: 'assets/home/service_0.png',
    },
    {
      prefix: 'HOME.SERVICE_1.',
      featureList: ['FEATURE_1', 'FEATURE_2', 'FEATURE_3', 'FEATURE_4'],
      imgSrc: 'assets/home/service_1.jpg',
    },
    {
      prefix: 'HOME.SERVICE_2.',
      featureList: ['FEATURE_1', 'FEATURE_2'],
      imgSrc: 'assets/home/service_2.jpg',
    },
    {
      prefix: 'HOME.SERVICE_3.',
      featureList: ['FEATURE_1', 'FEATURE_2'],
      imgSrc: 'assets/home/service_3.jpg',
    },
  ];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    this.SMQuery.addEventListener('change', this._SMQueryListener);
    this.MDQuery.addEventListener('change', this._MDQueryListener);
  }

  scrollTo(id: string): void {
    const el = document.getElementById(id);

    if (el !== null) {
      el.scrollIntoView({
        block: 'start',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();

    this.SMQuery.removeEventListener('change', this._SMQueryListener);
    this.MDQuery.removeEventListener('change', this._MDQueryListener);
  }
}
