import { Pipe, PipeTransform } from '@angular/core';
import { Locale, format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

@Pipe({
  name: 'dateFns',
  standalone: true,
})
export class DateFnsPipe implements PipeTransform {
  transform(
    value: string | number | Date | null | undefined,
    formatStr: string,
    locale?: Locale | null
  ): string {
    if (value === null || value === undefined) {
      return '';
    }

    const d = value instanceof Date ? value : new Date(value);

    return format(d, formatStr, { locale: locale ?? zhTW });
  }
}
