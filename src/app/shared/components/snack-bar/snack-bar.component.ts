import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

import { SnackBarData } from './snack-bar.models';
import { SnackType } from '../../enums/snack-type.enum';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [MatIconModule, MatSnackBarModule],
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss'],
})
export class SnackBarComponent {
  icon: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData) {
    switch (this.data.type) {
      case SnackType.Success:
        this.icon = 'check_circle';
        break;
      case SnackType.Error:
        this.icon = 'cancel';
        break;
      default:
        this.icon = 'error';
    }
  }
}
