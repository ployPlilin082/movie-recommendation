import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionsTabComponent } from './discussions-tab.component';

describe('DiscussionsTabComponent', () => {
  let component: DiscussionsTabComponent;
  let fixture: ComponentFixture<DiscussionsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscussionsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscussionsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
