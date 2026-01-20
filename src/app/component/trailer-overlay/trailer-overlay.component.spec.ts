import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerOverlayComponent } from './trailer-overlay.component';

describe('TrailerOverlayComponent', () => {
  let component: TrailerOverlayComponent;
  let fixture: ComponentFixture<TrailerOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailerOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailerOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
