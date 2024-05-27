import { FormControl } from '@angular/forms';

export interface RegisterFCs {
  /**
   * 帳號 (Email)
   */
  username: FormControl<string>;
  /**
   * 密碼
   */
  password: FormControl<string>;
  /**
   * 確認密碼
   */
  confirmPassword: FormControl<string>;
}
