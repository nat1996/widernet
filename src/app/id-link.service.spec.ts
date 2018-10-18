import { TestBed, inject } from '@angular/core/testing';

import { IdLinkService } from './id-link.service';

describe('IdLinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdLinkService]
    });
  });

  it('should be created', inject([IdLinkService], (service: IdLinkService) => {
    expect(service).toBeTruthy();
  }));
});
