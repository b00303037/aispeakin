import { Component, Input } from '@angular/core';
import { AsyncPipe, NgClass, NgFor } from '@angular/common';

import { MessageX } from '../stt-streaming.models';
import { MESSAGE_ROLE_OBJ } from '../../../../shared/enums/message-role.enum';
import { DateFnsPipe } from '../../../../shared/pipes/date-fns.pipe';
import { LocaleService } from '../../../../shared/services/locale.service';

@Component({
  selector: 'app-desktop-single',
  standalone: true,
  imports: [AsyncPipe, NgClass, NgFor, DateFnsPipe],
  templateUrl: './desktop-single.component.html',
  styleUrl: './desktop-single.component.scss',
})
export class DesktopSingleComponent {
  @Input() dateFnsFormatStr: string = 'PPpp';
  @Input() messageList: Array<MessageX> = [];
  @Input() flip?: boolean = false;

  locale$ = this.localeService.locale$;

  roleObj = MESSAGE_ROLE_OBJ;

  constructor(private localeService: LocaleService) {}

  trackByFn(index: number, message: MessageX): string {
    return message.trackId;
  }
}
