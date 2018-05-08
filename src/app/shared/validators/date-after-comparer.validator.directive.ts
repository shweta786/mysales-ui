import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Directive({
  selector: '[dateAfterComparer][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateAfterComparerValidator), multi: true}
  ]
})
export class DateAfterComparerValidator implements Validator {

  constructor( @Attribute('dateAfterComparer') public dateAfterComparer: string) { }

  validate(c: AbstractControl): { [key: string]: any } {
    let v: NgbDateStruct = c.value;
    if (!v) {
      return null;
    }

    let e = c.root.get(this.dateAfterComparer);
    let expirationDate = moment([v.year, v.month, v.day]);
    let effectiveDate = moment([e.value.year, e.value.month, e.value.day]);

    if (expirationDate.isSameOrBefore(effectiveDate)) {
      return {
        dateAfterComparer: false
      };
    }
    return null;
  }
}
