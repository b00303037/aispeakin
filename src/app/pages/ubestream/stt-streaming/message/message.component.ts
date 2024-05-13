import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { Locale } from 'date-fns';

import { MessageX } from '../stt-streaming.models';
import { MESSAGE_ROLE_OBJ } from '../../../../shared/enums/message-role.enum';
import { DateFnsPipe } from '../../../../shared/pipes/date-fns.pipe';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [AsyncPipe, NgClass, DateFnsPipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent implements OnInit {
  @Input() message!: MessageX;
  @Input() locale: Locale | null | undefined;
  @Input() swapped?: boolean;

  roleObj = MESSAGE_ROLE_OBJ;

  dateFnsFormatStr = 'PPpp';
  reverse = false;

  ngOnInit(): void {
    const reverse = this.message.role === this.roleObj.Native;

    this.reverse = this.swapped ? !reverse : reverse;
  }
}
