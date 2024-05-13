import { Component, Input } from '@angular/core';
import { AsyncPipe, NgClass, NgFor } from '@angular/common';

import { DesktopSingleComponent } from '../desktop-single/desktop-single.component';
import { MessageX } from '../stt-streaming.models';
import { MESSAGE_ROLE_OBJ } from '../../../../shared/enums/message-role.enum';
import { DateFnsPipe } from '../../../../shared/pipes/date-fns.pipe';
import { LocaleService } from '../../../../shared/services/locale.service';

@Component({
  selector: 'app-desktop-double',
  standalone: true,
  imports: [AsyncPipe, NgClass, NgFor, DesktopSingleComponent, DateFnsPipe],
  templateUrl: './desktop-double.component.html',
  styleUrl: './desktop-double.component.scss',
})
export class DesktopDoubleComponent {
  @Input() dateFnsFormatStr: string = 'PPpp';
  @Input() messageList: Array<MessageX> = [];

  locale$ = this.localeService.locale$;

  roleObj = MESSAGE_ROLE_OBJ;

  constructor(private localeService: LocaleService) {}
}
