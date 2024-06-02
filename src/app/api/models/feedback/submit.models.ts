import { BaseAPIResModel } from '../base-api.models';

export interface SubmitReq {
  experience: number;
  speed_and_accuracy: number;
  user_interface: number;
  business_comm: number;
  exhibitions: boolean;
  potential_revenue: number;
  email: string;
}

export type SubmitRes = BaseAPIResModel<null>;
