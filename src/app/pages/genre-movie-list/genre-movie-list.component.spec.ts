import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreMovieListComponent } from './genre-movie-list.component';

describe('GenreMovieListComponent', () => {
  let component: GenreMovieListComponent;
  let fixture: ComponentFixture<GenreMovieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreMovieListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenreMovieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
