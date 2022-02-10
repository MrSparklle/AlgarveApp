import { Pipe, PipeTransform } from '@angular/core';
import { formatDistance, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Pipe({
  name: 'fromNow'
})
export class FromNowPipe implements PipeTransform {
  transform(value: string): string {
    return formatDistance(parseISO(value), new Date(), { locale: ptBR, addSuffix: true });
  }
}
