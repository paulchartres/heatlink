import { TestBed } from '@angular/core/testing';

import { HistoryWsService } from './history-ws.service';

describe('HistoryService', () => {
  let service: HistoryWsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryWsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
