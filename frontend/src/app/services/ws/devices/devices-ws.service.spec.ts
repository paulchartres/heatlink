import { TestBed } from '@angular/core/testing';

import { DevicesWsService } from './devices-ws.service';

describe('DevicesWsService', () => {
  let service: DevicesWsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevicesWsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
