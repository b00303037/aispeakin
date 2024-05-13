import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  finalize,
  takeUntil,
  tap,
} from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

// @angular/material
import { MediaMatcher } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LoginFCs } from './login.models';
import { AbstractXService } from '../../api/abstract/abstract-x.service';
import { BaseAPIResModel } from '../../api/models/base-api.models';
import { XLoginReq } from '../../api/models/x/x-login.models';
import { AutofocusDirective } from '../../shared/directives/autofocus.directive';
import { SnackType } from '../../shared/enums/snack-type.enum';
import { AuthService } from '../../shared/services/auth.service';
import { SnackBarService } from '../../shared/services/snack-bar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    AutofocusDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private destroy$ = new Subject<null>();
  private _SMQueryListener = () => this.changeDetectorRef.detectChanges();

  SMQuery: MediaQueryList = this.media.matchMedia('(min-width: 600px)');

  fg = new FormGroup<LoginFCs>({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(25)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
  });
  fcs: LoginFCs = {
    username: this.fg.controls['username'],
    password: this.fg.controls['password'],
  };
  get fv() {
    return this.fg.getRawValue();
  }

  showPassword = false;
  loggingIn = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private router: Router,
    private xService: AbstractXService,
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) {
    this.SMQuery.addEventListener('change', this._SMQueryListener);
  }

  onLogin(): void {
    this.fg.markAllAsTouched();
    this.fg.updateValueAndValidity();

    if (this.fg.invalid || this.loggingIn) {
      return;
    }
    this.loggingIn = true;

    const { username, password } = this.fv;
    const req: XLoginReq = {
      username,
      password,
    };

    this.xService
      .XLogin(req)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loggingIn = false)),
        tap((res) => {
          const { accessToken } = res.content;

          this.authService.token = accessToken;

          if (this.authService.validateToken()) {
            this.authService.loggedIn$.next(true);

            this.snackBarService.add({
              message: res.message,
              type: SnackType.Success,
            });

            this.router.navigate(['/ubestream']);
          } else {
            // TODO ?
          }
        }),
        catchError((err) => this.onError(err))
      )
      .subscribe();
  }

  onError(err: BaseAPIResModel<null>): Observable<never> {
    console.error(err);

    this.snackBarService.add({ message: err.message, type: SnackType.Error });

    this.fcs['password'].reset();

    return EMPTY;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();

    this.SMQuery.removeEventListener('change', this._SMQueryListener);
  }
}
