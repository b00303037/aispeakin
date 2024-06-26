import { OptionList } from '../models/shared.models';

export enum RLang {
  ZH = 'zh',
  EN = 'en',
  JA = 'ja',
  KO = 'ko',
  TH = 'th',
  VI = 'vi',
  MS = 'ms',
  ID = 'id',
  FR = 'fr',
  ES = 'es',
  PT = 'pt',
  DE = 'de',
  RU = 'ru',
  IT = 'it',
  AR = 'ar',
}

export const RLANG_OPTION_LIST: OptionList<RLang> = [
  {
    label: '繁體中文',
    value: RLang.ZH,
  },
  {
    label: 'English',
    value: RLang.EN,
  },
  {
    label: '日本語',
    value: RLang.JA,
  },
  // {
  //   label: '한국어',
  //   value: RLang.KO,
  // },
];
