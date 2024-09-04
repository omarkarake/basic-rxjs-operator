import { TestBed } from '@angular/core/testing';

import { SimulateErrorUsersService } from './simulate-error-users.service';

describe('SimulateErrorUsersService', () => {
  let service: SimulateErrorUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulateErrorUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
