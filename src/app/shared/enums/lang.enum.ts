import { OptionList } from '../models/shared.models';

export enum Lang {
  EN = 'en',
  ZHTW = 'zh-tw',
  JA = 'ja',
}

export const LANG_OBJ = {
  EN: Lang.EN,
  ZHTW: Lang.ZHTW,
  JA: Lang.JA,
};

export const LANG_OPTION_LIST: OptionList<Lang> = [
  {
    label: 'English',
    value: Lang.EN,
  },
  {
    label: '繁體中文',
    value: Lang.ZHTW,
  },
  {
    label: '日本語',
    value: Lang.JA,
  },
];
