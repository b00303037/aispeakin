import { BaseAPIResModel } from '../base-api.models';

export interface AddLogReq {
  type: string;
}

export type AddLogRes = BaseAPIResModel<null>;
