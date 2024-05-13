import { FormControl } from '@angular/forms';

export interface LoginFCs {
  /**
   * 帳號
   */
  username: FormControl<string>;
  /**
   * 密碼
   */
  password: FormControl<string>;
}
