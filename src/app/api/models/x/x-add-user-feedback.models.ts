import { BaseAPIResModel } from '../base-api.models';

export interface XAddUserFeedbackReq {
  experience: number;
  speedAndAccuracy: number;
  interface: number;
  businessComm: number;
  exhibitions: boolean;
  potentialRevenue: number;
  email: string;
}

export type XAddUserFeedbackRes = BaseAPIResModel<null>;
