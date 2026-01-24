import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunityPost } from '../../../../services/CommunityService';
import { MoviePick } from '../../../../services/CommunityService';
import { CommunityService } from '../../../../services/CommunityService';



@Component({
  selector: 'app-reviews-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews-tab.component.html',
  styleUrl: './reviews-tab.component.css'
})
export class ReviewsTabComponent {
  constructor(private communityService: CommunityService) {}

  editingPostId: number | null = null;

  editDraft: {
    comment: string;
    rating: number | null;
    movieId: number | null;
    movieTitle: string | null;
    posterPath?: string | null;
  } | null = null;
  editMovieSearch = '';


  @Input() posts: CommunityPost[] = [];
  @Input() comments!: Record<number, any[]>;
  @Input() commentDraft!: Record<number, string>;
  @Input() openCommentId!: number | null;

  @Output() like = new EventEmitter<CommunityPost>();
  @Output() share = new EventEmitter<CommunityPost>();
  @Output() toggleComment = new EventEmitter<number>();
  @Output() sendComment = new EventEmitter<number>();
  @Output() delete = new EventEmitter<CommunityPost>();
  @Input() editMovieResults: MoviePick[] = [];
  @Output() reload = new EventEmitter<void>();



  @Output() update = new EventEmitter<{
    postId: number;
    comment: string;
    rating: number | null;
    movieId: number | null;
  }>();

  startEdit(p: CommunityPost) {
    this.editingPostId = p.postId;
    this.editDraft = {
      comment: p.comment,
      rating: p.rating,
      movieId: p.movieId,
      movieTitle: p.movieTitle,
      posterPath: p.posterPath
    };
  }

 saveEdit(p: CommunityPost) {
  if (!this.editDraft) return;

  this.communityService
    .updateReview(p.postId, {
      comment: this.editDraft.comment,
      rating: this.editDraft.rating,
      movieId: this.editDraft.movieId   
    })
    .subscribe({
      next: () => {
        p.comment = this.editDraft!.comment;
        p.rating = this.editDraft!.rating;
        p.movieId = this.editDraft!.movieId;
        p.movieTitle = this.editDraft!.movieTitle;
      
        this.reload.emit();
        this.cancelEdit();
      },
      error: err => console.error(err)
    });
}



  cancelEdit() {
    this.editingPostId = null;
    this.editDraft = null;
  }

  trackById(_: number, item: CommunityPost) {
    return item.postId;
  }
searchMovieForEdit(q: string) {
  if (q.length < 2) {
    this.editMovieResults = [];
    return;
  }

  this.communityService.searchMovies(q, 6)
    .subscribe(r => this.editMovieResults = r);
}


selectEditMovie(m: MoviePick) {
  if (!this.editDraft) return;

  this.editDraft.movieId = m.tmdbMovieId;
  this.editDraft.movieTitle = m.title;
  this.editDraft.posterPath = m.posterPath; // 🔥 สำคัญมาก
  this.editMovieResults = [];
}




}





