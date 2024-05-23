import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

// @angular/material
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-survey-link-dialog',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogTitle,
    MatIconModule,
  ],
  templateUrl: './survey-link-dialog.component.html',
  styleUrl: './survey-link-dialog.component.scss',
})
export class SurveyLinkDialogComponent {}
