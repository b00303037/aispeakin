import { OptionList } from '../models/shared.models';

export enum Lang {
  ZHTW = 'zh-tw',
  EN = 'en',
  JA = 'ja',
}

export const LANG_OPTION_LIST: OptionList<Lang> = [
  {
    label: '繁體中文',
    value: Lang.ZHTW,
  },
  {
    label: 'English',
    value: Lang.EN,
  },
  {
    label: '日本語',
    value: Lang.JA,
  },
];
