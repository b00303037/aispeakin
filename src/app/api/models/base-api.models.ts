import { BaseAPICode } from '../../shared/enums/base-api-code.enum';

export interface BaseAPIResModel<T> {
  /**
   * 回覆代碼
   */
  code: BaseAPICode;
  /**
   * 回覆訊息
   */
  msg: string;
  /**
   * 回覆訊息鍵
   */
  msg_key: string;
  /**
   * 回覆內容
   */
  data: T;
}
