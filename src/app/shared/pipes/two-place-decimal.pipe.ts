import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'twoDecimal',
    pure: false,
})
export class TwoPlaceDecimalPipe implements PipeTransform {
    transform(value: any, attr: string): any {
        if (!value) return value;

        let with2Decimals = value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
        return with2Decimals;
    }
}
