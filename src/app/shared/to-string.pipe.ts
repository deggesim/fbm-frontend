import { Pipe, PipeTransform } from '@angular/core';
import { isEmpty } from '@app/shared/globals';

@Pipe({
  name: 'toString'
})
export class ToStringPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let ret = '';
    let endOfRet = '';
    let field;
    if (args != null && !isEmpty(args)) {
      field = args[0];
      ret += '<ul>';
      endOfRet = '</ul>';
    }
    for (const item of value) {
      ret += '<li>' + item[field] + '</li>';
    }
    return ret + endOfRet;
  }

}
