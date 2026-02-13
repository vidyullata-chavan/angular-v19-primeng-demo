import { TestBed } from '@angular/core/testing';

import { RuleSessionService } from './rule-session.service';

describe('RuleService', () => {
  let service: RuleSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuleSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
