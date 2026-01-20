import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TRAILER_DATA } from '../../services/trailer-overlay.token';

@Component({
  selector: 'app-trailer-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trailer-overlay.component.html',
  styleUrls: ['./trailer-overlay.component.css']
})
export class TrailerOverlayComponent {
  url: SafeResourceUrl;

 constructor(
  private sanitizer: DomSanitizer,
  @Inject(TRAILER_DATA)
  public data: {
    youtubeKey: string;
    close: () => void;
  }
) {
  const raw =
    `https://www.youtube.com/embed/${data.youtubeKey}?autoplay=1&rel=0&wmode=opaque`;
  this.url = this.sanitizer.bypassSecurityTrustResourceUrl(raw);
}

  close() {
    this.data.close();
  }
}
