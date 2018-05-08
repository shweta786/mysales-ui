/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BrandService } from './brand.service';
import {APILogService} from "./api-log.service";

describe('Service: APILog', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [APILogService]
    });
  });

  // it('should ...', inject([BillingNumberService], (service: BillingNumberService) => {
  //   expect(service).toBeTruthy();
  // }));
});
