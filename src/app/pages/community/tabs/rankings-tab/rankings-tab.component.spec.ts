import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingsTabComponent } from './rankings-tab.component';

describe('RankingsTabComponent', () => {
  let component: RankingsTabComponent;
  let fixture: ComponentFixture<RankingsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
