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

import { AddUserFeedbackFCs } from './survey-link-dialog.models';
import { SnackType } from '../../enums/snack-type.enum';
import { SnackBarService } from '../../services/snack-bar.service';
import { AbstractXService } from '../../../api/abstract/abstract-x.service';
import { BaseAPIResModel } from '../../../api/models/base-api.models';
import { XAddUserFeedbackReq } from '../../../api/models/x/x-add-user-feedback.models';

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

  langFC = new FormControl('zh-tw', { validators: [Validators.required] });

  fg = new FormGroup<AddUserFeedbackFCs>({
    experience: new FormControl(null, {
      validators: [Validators.required],
    }),
    speedAndAccuracy: new FormControl(null, {
      validators: [Validators.required],
    }),
    interface: new FormControl(null, {
      validators: [Validators.required],
    }),
    businessComm: new FormControl(null, {
      validators: [Validators.required],
    }),
    exhibitions: new FormControl(null, {
      validators: [Validators.required],
    }),
    potentialRevenue: new FormControl(null, {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.maxLength(50)],
    }),
  });
  fcs: AddUserFeedbackFCs = {
    experience: this.fg.controls['experience'],
    speedAndAccuracy: this.fg.controls['speedAndAccuracy'],
    interface: this.fg.controls['interface'],
    businessComm: this.fg.controls['businessComm'],
    exhibitions: this.fg.controls['exhibitions'],
    potentialRevenue: this.fg.controls['potentialRevenue'],
    email: this.fg.controls['email'],
  };
  get fv() {
    return this.fg.getRawValue();
  }

  QUESTIONS_ZHTW = [
    {
      question:
        '您對於 AI 即時翻譯助手的 <strong>使用體驗</strong> 感到滿意嗎？',
      options: [
        { label: '非常滿意', value: 2 },
        { label: '滿意', value: 1 },
        { label: '一般', value: 0 },
        { label: '不滿意', value: -1 },
        { label: '非常不滿意', value: -2 },
      ],
    },
    {
      question: '您對於 AI 即時翻譯助手的 <strong>速度準確度</strong> 滿意嗎？',
      options: [
        { label: '非常滿意', value: 2 },
        { label: '滿意', value: 1 },
        { label: '一般', value: 0 },
        { label: '不滿意', value: -1 },
        { label: '非常不滿意', value: -2 },
      ],
    },
    {
      question:
        '您認為 AI 即時翻譯助手的 <strong>介面操作</strong> 是否簡便易用？',
      options: [
        { label: '非常簡便', value: 2 },
        { label: '簡便', value: 1 },
        { label: '一般', value: 0 },
        { label: '複雜', value: -1 },
        { label: '非常複雜', value: -2 },
      ],
    },
    {
      question: '您同意 AI 即時翻譯助手有助於 <strong>商洽溝通</strong> 嗎？',
      options: [
        { label: '非常同意', value: 2 },
        { label: '同意', value: 1 },
        { label: '一般', value: 0 },
        { label: '不同意', value: -1 },
        { label: '非常不同意', value: -2 },
      ],
    },
    {
      question: '整體來說，您覺得 AI 即時翻譯助手能幫助您參觀展覽嗎？',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
    {
      question:
        '透過 AI 即時翻譯助手進行商洽，能為您的公司創造多少 <strong>潛在營收</strong>？',
      options: [
        { label: '高於 1,000 萬美元', value: 6 },
        { label: '500 萬美元', value: 5 },
        { label: '100 萬美元', value: 4 },
        { label: '50 萬美元', value: 3 },
        { label: '10 萬美元', value: 2 },
        { label: '低於 10 萬美元', value: 1 },
      ],
    },
    {
      question: '歡迎留下您的 <strong>電子郵件信箱</strong>！',
      options: [],
    },
  ];
  QUESTIONS_EN = [
    {
      question:
        'Are you satisfied with the <strong>experience</strong> of using the AI real-time translation assistant?',
      options: [
        { label: 'Very satisfied', value: 2 },
        { label: 'Satisfied', value: 1 },
        { label: 'Neutral', value: 0 },
        { label: 'Dissatisfied', value: -1 },
        { label: 'Very dissatisfied', value: -2 },
      ],
    },
    {
      question:
        'Are you satisfied with the <strong>speed and accuracy</strong> of the AI real-time translation assistant?',
      options: [
        { label: 'Very satisfied', value: 2 },
        { label: 'Satisfied', value: 1 },
        { label: 'Neutral', value: 0 },
        { label: 'Dissatisfied', value: -1 },
        { label: 'Very dissatisfied', value: -2 },
      ],
    },
    {
      question:
        'Do you find the <strong>interface</strong> of the AI real-time translation assistant easy to use?',
      options: [
        { label: 'Very easy', value: 2 },
        { label: 'Easy', value: 1 },
        { label: 'Neutral', value: 0 },
        { label: 'Complicated', value: -1 },
        { label: 'Very complicated', value: -2 },
      ],
    },
    {
      question:
        'Do you agree that the AI real-time translation assistant is helpful for <strong>business communication</strong>?',
      options: [
        { label: 'Strongly agree', value: 2 },
        { label: 'Agree', value: 1 },
        { label: 'Neutral', value: 0 },
        { label: 'Disagree', value: -1 },
        { label: 'Strongly disagree', value: -2 },
      ],
    },
    {
      question:
        'Overall, do you think the real-time translation assistant helps you in visiting exhibitions?',
      options: [
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 },
      ],
    },
    {
      question:
        'How much <strong>potential revenue</strong> can be generated for your company through business negotiations using the AI real-time translation assistant?',
      options: [
        { label: 'Greater than 10 million USD', value: 6 },
        { label: '5 million USD', value: 5 },
        { label: '1 million USD', value: 4 },
        { label: '500,000 USD', value: 3 },
        { label: '100,000 USD', value: 2 },
        { label: 'Less than 100,000 USD', value: 1 },
      ],
    },
    {
      question: 'Please leave your <strong>email address</strong>!',
      options: [],
    },
  ];
  question = this.QUESTIONS_ZHTW;

  adding = false;

  constructor(
    private dialogRef: MatDialogRef<SurveyLinkDialogComponent>,
    private xService: AbstractXService,
    private snackBarService: SnackBarService,
    public t: TranslateService
  ) {
    this.langFC.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((_lang) => {
          switch (_lang) {
            case 'zh-tw':
              this.question = this.QUESTIONS_ZHTW;
              break;
            case 'en':
              this.question = this.QUESTIONS_EN;
              break;
          }
        })
      )
      .subscribe();
  }

  onAddUserFeedback(): void {
    this.fg.markAllAsTouched();
    this.fg.updateValueAndValidity();

    if (this.fg.invalid || this.adding) {
      return;
    }
    this.adding = true;

    const req: XAddUserFeedbackReq = {
      experience: this.fv.experience as number,
      speedAndAccuracy: this.fv.speedAndAccuracy as number,
      interface: this.fv.interface as number,
      businessComm: this.fv.businessComm as number,
      exhibitions: this.fv.exhibitions ? true : false,
      potentialRevenue: this.fv.potentialRevenue as number,
      email: this.fv.email,
    };

    this.xService
      .XAddUserFeedback(req)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.adding = false)),
        tap((res) => {
          this.t.get(res.message).subscribe((message) => {
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

    this.t.get(err.message).subscribe((message) => {
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
