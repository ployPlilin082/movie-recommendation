import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerButtonComponent } from './trailer-button.component';

describe('TrailerButtonComponent', () => {
  let component: TrailerButtonComponent;
  let fixture: ComponentFixture<TrailerButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailerButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
