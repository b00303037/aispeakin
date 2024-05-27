import {
  AbstractControl,
  FormControl,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class ValidatorsExtra {
  static passwordMatch(paths: [string, string]): ValidatorFn {
    return passwordMatchValidator(paths);
  }
}

export function passwordMatchValidator(paths: [string, string]): ValidatorFn {
  return (control): ValidationErrors | null => {
    const fcA = control.get(paths[0]) as AbstractControl<string>;
    const fcB = control.get(paths[1]) as AbstractControl<string>;

    const a = fcA.value;
    const b = fcB.value;

    if (asValid(fcA) || asValid(fcB) || isEmpty(a) || isEmpty(b)) {
      return null;
    }

    if (!isEmpty(a) && !isEmpty(b) && a === b) {
      return null;
    }

    return { passwordMatch: true };
  };
}

export class FormErrorStateMatcher implements ErrorStateMatcher {
  errorName: string;

  constructor(errorName: string) {
    this.errorName = errorName;
  }

  isErrorState(
    control: FormControl,
    form: FormGroupDirective | NgForm
  ): boolean {
    return (
      !asValid(control) && (control.invalid || form.hasError(this.errorName))
    );
  }
}

export class PasswordMatchErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl,
    form: FormGroupDirective | NgForm
  ): boolean {
    return (
      !asValid(control) && (control.invalid || form.hasError('passwordMatch'))
    );
  }
}

function isEmpty(value: unknown): boolean {
  return value === '' || value === null || value === undefined;
}

function asValid(control: AbstractControl): boolean {
  return control.disabled || (control.untouched && control.pristine);
}
