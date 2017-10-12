import { TestBed, inject } from '@angular/core/testing';

import { BackandService } from './backand.service';

describe('BackandService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackandService]
    });
  });

  it('should be created', inject([BackandService], (service: BackandService) => {
    expect(service).toBeTruthy();
  }));
});
