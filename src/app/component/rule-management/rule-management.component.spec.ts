import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleManagementComponent } from './rule-management.component';

describe('RuleManagementComponent', () => {
  let component: RuleManagementComponent;
  let fixture: ComponentFixture<RuleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
