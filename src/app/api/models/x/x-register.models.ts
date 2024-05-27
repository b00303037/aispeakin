import { BaseAPIResModel } from '../base-api.models';

export interface XRegisterReq {
  /**
   * 帳號
   */
  username: string;
  /**
   * 密碼
   */
  password: string;
}

export type XRegisterRes = BaseAPIResModel<null>;
