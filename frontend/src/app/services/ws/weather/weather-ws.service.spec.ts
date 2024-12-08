import { TestBed } from '@angular/core/testing';

import { WeatherWsService } from './weather-ws.service';

describe('WeatherService', () => {
  let service: WeatherWsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherWsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
