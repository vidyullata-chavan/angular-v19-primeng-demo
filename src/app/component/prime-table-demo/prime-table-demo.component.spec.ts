import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeTableDemoComponent } from './prime-table-demo.component';

describe('PrimeTableDemoComponent', () => {
  let component: PrimeTableDemoComponent;
  let fixture: ComponentFixture<PrimeTableDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeTableDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeTableDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
