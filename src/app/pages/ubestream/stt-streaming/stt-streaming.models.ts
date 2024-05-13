import { MessageRole } from '../../../shared/enums/message-role.enum';

export interface RouteData {
  APIKey: string;
}

export interface MessageO {
  message_index: number;
  language: string;
  text: string;
  translated_text: string;
}

export interface MessageX {
  mid: string;
  role: MessageRole;
  text: string;
  tran: string;
  date: Date;
  trackId: string;
}
