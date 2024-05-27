import { FormControl } from '@angular/forms';

export interface AddUserFeedbackFCs {
  experience: FormControl<number | null>;
  speedAndAccuracy: FormControl<number | null>;
  interface: FormControl<number | null>;
  businessComm: FormControl<number | null>;
  exhibitions: FormControl<number | null>;
  potentialRevenue: FormControl<number | null>;
  email: FormControl<string>;
}
