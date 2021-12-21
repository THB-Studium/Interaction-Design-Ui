import { TestBed } from '@angular/core/testing';

import { CountryInformationService } from './country-information.service';

describe('CountryInformationService', () => {
  let service: CountryInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
