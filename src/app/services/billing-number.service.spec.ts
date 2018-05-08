/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BrandService } from './brand.service';
import {BillingNumberService} from "./billing-number.service";

describe('Service: BillingNumber', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillingNumberService]
    });
  });

  // it('should ...', inject([BillingNumberService], (service: BillingNumberService) => {
  //   expect(service).toBeTruthy();
  // }));
});
