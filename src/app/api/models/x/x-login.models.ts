import { BaseAPIResModel } from '../base-api.models';

export interface XLoginReq {
  /**
   * 帳號
   */
  username: string;
  /**
   * 密碼
   */
  password: string;
}

export type XLoginRes = BaseAPIResModel<{
  /**
   * 存取權杖
   */
  accessToken: string;
  /**
   * 存取權杖的有效期
   *
   * - 單位為秒
   */
  expiresIn: number;
}>;
