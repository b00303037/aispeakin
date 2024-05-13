import { Component } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// @angular/materia
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
export class HomeComponent {
  serviceList: Array<{
    prefix: string;
    featureList: Array<string>;
  }> = [
    { prefix: 'HOME.SERVICE_0.', featureList: ['FEATURE_1', 'FEATURE_2'] },
    {
      prefix: 'HOME.SERVICE_1.',
      featureList: ['FEATURE_1', 'FEATURE_2', 'FEATURE_3', 'FEATURE_4'],
    },
    { prefix: 'HOME.SERVICE_2.', featureList: ['FEATURE_1', 'FEATURE_2'] },
    { prefix: 'HOME.SERVICE_3.', featureList: ['FEATURE_1', 'FEATURE_2'] },
  ];

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
}
