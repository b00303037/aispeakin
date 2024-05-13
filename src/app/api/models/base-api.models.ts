import { BaseAPICode } from '../../shared/enums/base-api-code.enum';

export interface BaseAPIResModel<T> {
  /**
   * 是否成功
   */
  success: boolean;
  /**
   * 回覆代碼
   */
  code: BaseAPICode;
  /**
   * 回覆訊息
   */
  message: string;
  /**
   * 回覆內容
   */
  content: T;
}
