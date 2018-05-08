/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ComponentItemService } from './component-item.service';

describe('Service: Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComponentItemService]
    });
  });

  it('should ...', inject([ComponentItemService], (service: ComponentItemService) => {
    expect(service).toBeTruthy();
  }));
});
