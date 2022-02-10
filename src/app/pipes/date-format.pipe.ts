import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    const [fmt] = args;
    return format(parseISO(value), fmt, { locale: ptBR });
  }
}
