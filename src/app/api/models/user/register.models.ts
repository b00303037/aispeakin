import { BaseAPIResModel } from '../base-api.models';

export interface RegisterReq {
  /**
   * 帳號
   */
  account: string;
  /**
   * 密碼
   */
  password: string;
}

export type RegisterRes = BaseAPIResModel<null>;
