import { SnackType } from '../../enums/snack-type.enum';

export class Snack {
  message: string;
  type?: SnackType;

  constructor(data: { message: string; type?: SnackType }) {
    this.message = data.message;
    this.type = data.type;
  }
}

export type SnackBarData = Snack;
