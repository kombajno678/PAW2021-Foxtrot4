import { TestBed } from '@angular/core/testing';

import { DummyAuthService } from './dummy-auth.service';

describe('DummyAuthService', () => {
  let service: DummyAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DummyAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
