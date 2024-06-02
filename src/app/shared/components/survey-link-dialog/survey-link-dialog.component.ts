import { Component, OnDestroy } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  finalize,
  takeUntil,
  tap,
} from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// @angular/material
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SubmitFCs } from './survey-link-dialog.models';
import { QUESTIONS_EN } from './questions/questions-en';
import { QUESTIONS_ZHTW } from './questions/questions-zhtw';
import { QUESTIONS_JA } from './questions/questions-ja';
import { LANG_OBJ, Lang } from '../../enums/lang.enum';
import { SnackType } from '../../enums/snack-type.enum';
import { SnackBarService } from '../../services/snack-bar.service';
import { AbstractFeedbackService } from '../../../api/abstract/abstract-feedback.service';
import { BaseAPIResModel } from '../../../api/models/base-api.models';
import { SubmitReq } from '../../../api/models/feedback/submit.models';

@Component({
  selector: 'app-survey-link-dialog',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatTabsModule,
    MatTooltipModule,
  ],
  templateUrl: './survey-link-dialog.component.html',
  styleUrl: './survey-link-dialog.component.scss',
})
export class SurveyLinkDialogComponent implements OnDestroy {
  private destroy$ = new Subject<null>();
  selectedIndex = 0;

  langFC = new FormControl<Lang | null>(null, {
    validators: [Validators.required],
  });

  fg = new FormGroup<SubmitFCs>({
    experience: new FormControl(null, {
      validators: [Validators.required],
    }),
    speed_and_accuracy: new FormControl(null, {
      validators: [Validators.required],
    }),
    user_interface: new FormControl(null, {
      validators: [Validators.required],
    }),
    business_comm: new FormControl(null, {
      validators: [Validators.required],
    }),
    exhibitions: new FormControl(null, {
      validators: [Validators.required],
    }),
    potential_revenue: new FormControl(null, {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.maxLength(50)],
    }),
  });
  fcs: SubmitFCs = {
    experience: this.fg.controls['experience'],
    speed_and_accuracy: this.fg.controls['speed_and_accuracy'],
    user_interface: this.fg.controls['user_interface'],
    business_comm: this.fg.controls['business_comm'],
    exhibitions: this.fg.controls['exhibitions'],
    potential_revenue: this.fg.controls['potential_revenue'],
    email: this.fg.controls['email'],
  };
  mcqFCNames: Array<keyof SubmitFCs> = [
    'experience',
    'speed_and_accuracy',
    'user_interface',
    'business_comm',
    'exhibitions',
    'potential_revenue',
  ];
  get fv() {
    return this.fg.getRawValue();
  }

  langObj = LANG_OBJ;
  questions:
    | Array<{
        question: string;
        options: Array<{
          label: string;
          value: number;
        }>;
      }>
    | undefined;

  adding = false;

  constructor(
    private dialogRef: MatDialogRef<SurveyLinkDialogComponent>,
    private feedbackService: AbstractFeedbackService,
    private snackBarService: SnackBarService,
    public t: TranslateService
  ) {
    this.langFC.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((_lang) => {
          if (_lang !== null) {
            this.t.use(_lang);

            document.documentElement.setAttribute('lang', _lang);
          }

          switch (_lang) {
            case 'en':
              this.questions = QUESTIONS_EN;
              break;
            case 'zh-tw':
              this.questions = QUESTIONS_ZHTW;
              break;
            case 'ja':
              this.questions = QUESTIONS_JA;
              break;
            default:
              this.questions = undefined;
          }
        })
      )
      .subscribe();

    if (Object.values(Lang).includes(this.t.currentLang as Lang)) {
      this.langFC.setValue(this.t.currentLang as Lang);
    }
  }

  onSubmit(): void {
    this.fg.markAllAsTouched();
    this.fg.updateValueAndValidity();

    if (this.fg.invalid || this.adding) {
      return;
    }
    this.adding = true;

    const req: SubmitReq = {
      experience: this.fv.experience as number,
      speed_and_accuracy: this.fv.speed_and_accuracy as number,
      user_interface: this.fv.user_interface as number,
      business_comm: this.fv.business_comm as number,
      exhibitions: this.fv.exhibitions ? true : false,
      potential_revenue: this.fv.potential_revenue as number,
      email: this.fv.email,
    };

    this.feedbackService
      .Submit(req)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.adding = false)),
        tap((res) => {
          this.t.get(res.msg_key).subscribe((message) => {
            this.snackBarService.add({
              message,
              type: SnackType.Success,
            });
          });

          this.dialogRef.close();
        }),
        catchError((err) => this.onError(err))
      )
      .subscribe();
  }

  onError(err: BaseAPIResModel<null>): Observable<never> {
    console.error(err);

    this.t.get(err.msg_key).subscribe((message) => {
      this.snackBarService.add({
        message,
        type: SnackType.Error,
      });
    });

    return EMPTY;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
