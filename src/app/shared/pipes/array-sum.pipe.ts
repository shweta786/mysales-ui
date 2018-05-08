import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sum',
    pure: false,
})
export class SumPipe implements PipeTransform {
    transform(items: any[], attr: string, func: any): any {
        if (attr) {
            return items.reduce((a, b) => a + b[attr], 0);
        }else {
            return func(items);
        }
    }
}
