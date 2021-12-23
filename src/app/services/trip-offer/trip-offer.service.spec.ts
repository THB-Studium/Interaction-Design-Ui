import { TestBed } from '@angular/core/testing';

import { TripOfferService } from './trip-offer.service';

describe('TripOfferService', () => {
  let service: TripOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
