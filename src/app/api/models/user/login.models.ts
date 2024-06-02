import { BaseAPIResModel } from '../base-api.models';

export interface LoginReq {
  /**
   * 帳號
   */
  account: string;
  /**
   * 密碼
   */
  password: string;
}

export type LoginRes = BaseAPIResModel<{
  /**
   * 存取權杖
   */
  token: string;
}>;
