import { Component, Input, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TrailerOverlayComponent } from '../trailer-overlay/trailer-overlay.component';
import { TRAILER_DATA } from '../../services/trailer-overlay.token';
import { UserHistoryService } from '../../services/๊userhistory.service';

@Component({
  selector: 'app-trailer-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trailer-button.component.html',
  styleUrls: ['./trailer-button.component.css']
})
export class TrailerButtonComponent {
  @Input({ required: true }) tmdbId!: number;
  @Input() mediaType: string = 'movie';

  loading = false;

  constructor(
    private movieService: MovieService,
    private overlay: Overlay,
    private injector: Injector,
    private userHistoryService: UserHistoryService
  ) {}

 onClick() {
  if (!this.tmdbId) return;

  this.loading = true;

  this.movieService.getVideos(this.tmdbId, this.mediaType).subscribe({
    next: (res: any) => {
      const trailer =
        res.results?.find(
          (v: any) => v.site === 'YouTube' && v.type === 'Trailer'
        );

      if (!trailer) {
        alert('ไม่มีตัวอย่าง');
        return;
      }

      
      this.userHistoryService.log({
        movieId: this.tmdbId,
        interactionTypeId: 1 // View
      }).subscribe();

      this.openOverlay(trailer.key);
    },
    complete: () => (this.loading = false),
    error: () => alert('โหลด Trailer ไม่สำเร็จ')
  });
}


 openOverlay(youtubeKey: string) {
  const overlayRef = this.overlay.create({
    hasBackdrop: true,
    backdropClass: 'cdk-overlay-dark-backdrop',
    scrollStrategy: this.overlay.scrollStrategies.block()
  });

  const injector = Injector.create({
    providers: [
      {
        provide: TRAILER_DATA,
        useValue: {
          youtubeKey,
          close: () => overlayRef.dispose() // 🔥 สำคัญ
        }
      }
    ],
    parent: this.injector
  });

  overlayRef.attach(
    new ComponentPortal(TrailerOverlayComponent, null, injector)
  );

  overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
}

  }

