import { Pipe, PipeTransform } from '@angular/core';

// use custom pipe "trimOutletName" to remove " - ABC News" at the end of article title
@Pipe({
  name: 'trimOutletName',
})
export class TrimOutletNamePipe implements PipeTransform {
  // 2nd arg "outletName" is the variable after pipe name in templte
  transform(title: string, outletName: string): string {
    return title.replace(` - ${outletName}`, '');
  }
}
