import { FormControl } from '@angular/forms';

export interface SubmitFCs {
  experience: FormControl<number | null>;
  speed_and_accuracy: FormControl<number | null>;
  user_interface: FormControl<number | null>;
  business_comm: FormControl<number | null>;
  exhibitions: FormControl<number | null>;
  potential_revenue: FormControl<number | null>;
  email: FormControl<string>;
}
