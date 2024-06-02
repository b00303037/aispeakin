import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MessageRole } from '../enums/message-role.enum';
import {
  MessageO,
  MessageX,
} from '../../pages/ubestream/stt-streaming/stt-streaming.models';

@Injectable({
  providedIn: 'root',
})
export class STTStreamingService {
  // TODO: 以日期分組，減少重複的年月日內容
  messageList$ = new BehaviorSubject<Array<MessageX>>([]);
  toScroll$ = new BehaviorSubject<boolean>(false);

  // TODO: Queue 機制，避免交叉錯誤
  addOrUpdate(
    messageO: MessageO,
    info: { prefix: number; main_lang: string }
  ): void {
    const messageX: MessageX = this.transformO(messageO, info);

    const _list = this.messageList$.getValue();
    let _index = _list.findIndex((m) => m.mid === messageX.mid);

    if (_index === -1) {
      messageX.trackId = `${messageX.mid}-${1}`;

      _list.push(messageX);
    } else {
      const trackSeq = +_list[_index].trackId.split('-').slice(-1)[0];

      messageX.trackId = `${messageX.mid}-${trackSeq + 1}`;

      _list[_index] = messageX;
    }

    this.messageList$.next(_list);
  }

  clear(): void {
    this.messageList$.next([]);
  }

  transformO(
    messageO: MessageO,
    info: { prefix: number; main_lang: string }
  ): MessageX {
    return {
      mid: `${info.prefix}-${messageO.message_index}`,
      role:
        messageO.language === info.main_lang
          ? MessageRole.Native
          : MessageRole.Foreigner,
      text: messageO.text,
      tran: messageO.translated_text,
      date: new Date(),
      trackId: '',
    };
  }
}
