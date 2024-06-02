import { FormControl } from '@angular/forms';

export interface LoginFCs {
  /**
   * 帳號
   */
  account: FormControl<string>;
  /**
   * 密碼
   */
  password: FormControl<string>;
}
