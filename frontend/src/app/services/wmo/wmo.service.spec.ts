import { TestBed } from '@angular/core/testing';

import { WmoService } from './wmo.service';

describe('WmoService', () => {
  let service: WmoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WmoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
