import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCalculatorComponent } from './cost-calculator.component';

describe('CostCalculatorComponent', () => {
  let component: CostCalculatorComponent;
  let fixture: ComponentFixture<CostCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
