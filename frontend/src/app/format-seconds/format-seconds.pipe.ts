import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatSeconds',
  pure: true
})
export class FormatSecondsPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    const minutes = Math.floor(value / 60);
    const seconds = `${value % 60}`.padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

}
