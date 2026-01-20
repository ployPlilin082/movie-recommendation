import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

import {
  CommunityService,
  CommunityPost,
  TopMovie,
  MoviePick
} from '../../services/CommunityService';

import { ReviewsTabComponent } from './tabs/reviews-tab/reviews-tab.component';
import { DiscussionsTabComponent } from './tabs/discussions-tab/discussions-tab.component';
import { RankingsTabComponent } from './tabs/rankings-tab/rankings-tab.component';
import { EventsTabComponent } from './tabs/events-tab/events-tab.component';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReviewsTabComponent,
    DiscussionsTabComponent,
    RankingsTabComponent,
    EventsTabComponent
  ],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent implements OnInit {

  /* ---------- TAB ---------- */
  activeTab: 'reviews' | 'discussions' | 'rankings' | 'events' = 'reviews';

  setTab(tab: typeof this.activeTab) {
    this.activeTab = tab;
    if (tab === 'reviews') this.loadReviews();
    if (tab === 'discussions') this.loadDiscussions();
    if (tab === 'rankings') this.loadRankings();
    if (tab === 'events') this.loadEvents();
  }

  /* ---------- COMMON ---------- */
  loading = false;
  error: string | null = null;

  /* ---------- REVIEWS ---------- */
  posts: CommunityPost[] = [];
  openCommentId: number | null = null;
  comments: Record<number, any[]> = {};
  commentDraft: Record<number, string> = {};

  /* ---------- DISCUSSIONS ---------- */
  discussions: any[] = [];

  /* ---------- RANKINGS ---------- */
  topMovies: TopMovie[] = [];

  /* ---------- EVENTS ---------- */
  events: any[] = [];

  /* ---------- CREATE REVIEW ---------- */
  ifCreated = false;
  searchText = '';
  searchResults: MoviePick[] = [];
  selectedMovie: MoviePick | null = null;
  sharePost: CommunityPost | null = null;

  form!: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private community: CommunityService,
    private auth: AuthService

  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      movieId: [null as number | null, Validators.required],
      comment: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
    });

    this.loadReviews();
  }

  /* ---------- LOADERS ---------- */
loadReviews() {
  this.loading = true;

  this.community.getPosts(20).subscribe(async posts => {
    const user = await this.auth.getCurrentUser();

    this.posts = posts.map(p => ({
      ...p,
    }));

    this.loading = false;
  });
}
getShareUrl(postId: number) {
  return `${window.location.origin}/community/reviews/${postId}`;
}



  loadDiscussions() {
    this.community.getDiscussions(20)
      .subscribe(r => this.discussions = r);
  }

  loadRankings() {
    this.community.getTopMovies(3)
      .subscribe(r => this.topMovies = r);
  }

  
loadEvents() {
  console.log('🔥 loadEvents called');
  this.community.getEvents(20)
    .subscribe(r => {
      console.log('✅ events:', r);
      this.events = r;
    });
}
  /* ---------- REVIEW ACTIONS ---------- */
 like(p: CommunityPost) {
  this.community.likeReview(p.postId).subscribe(res => {
    if (res.liked) {
      p.likeCount++;
      p.isLikedByMe = true;
    } else {
      p.likeCount--;
      p.isLikedByMe = false;
    }
  });
}



 share(postId: number) {
  const url = this.getShareUrl(postId);

  // 1. บันทึก share ใน backend
  this.community.shareReview(postId).subscribe();

  // 2. แชร์ออกนอก
  if (navigator.share) {
    navigator.share({
      title: 'Movie Review',
      text: 'มาดูรีวิวหนังเรื่องนี้กัน 🎬',
      url
    });
  } else {
    this.openShareFallback(url);
  }
}
openShareFallback(url: string) {
  const encoded = encodeURIComponent(url);

  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
  const line = `https://social-plugins.line.me/lineit/share?url=${encoded}`;
  const x = `https://twitter.com/intent/tweet?url=${encoded}`;

  // เปิด popup เลือกเอง หรือทำ modal
  window.open(fb, '_blank', 'width=600,height=500');
}
openShare(p: CommunityPost) {
  const url = this.getShareUrl(p.postId);

  // 1️⃣ บันทึก share ใน backend
  this.community.shareReview(p.postId).subscribe(() => {
    p.shareCount = (p.shareCount ?? 0) + 1;
  });

  if (navigator.share) {
    navigator.share({
      title: p.movieTitle ?? 'Movie Review',
      text: 'มาดูรีวิวหนังเรื่องนี้ 🎬',
      url
    });
  } else {
    this.openShareFallback(url);
  }
}


copyLink() {
  const url = this.getShareUrl(this.sharePost!.postId);
  navigator.clipboard.writeText(url);
  alert('คัดลอกลิงก์แล้ว');
}


 toggleComment(id: number) {
  this.openCommentId = this.openCommentId === id ? null : id;

  if (this.openCommentId && !this.comments[id]) {
    this.community.getReviewComments(id)
      .subscribe(r => this.comments[id] = r);
  }
}

  

  sendComment(id: number) {
    const text = this.commentDraft[id]?.trim();
    if (!text) return;

    this.community.addReviewComment(id, text).subscribe(() => {
      this.commentDraft[id] = '';
      this.community.getReviewComments(id)
        .subscribe(r => this.comments[id] = r);
    });
  }

  /* ---------- CREATE REVIEW ---------- */
  openCreate() { this.ifCreated = true; }

  closeCreate() {
    this.ifCreated = false;
    this.searchText = '';
    this.searchResults = [];
    this.selectedMovie = null;
    this.form.reset({ movieId: null, comment: '', rating: 5 });
  }

  onSearchChange(q: string) {
    this.searchText = q;
    if (q.length < 2) return;

    this.community.searchMovies(q, 10)
      .subscribe(r => this.searchResults = r);
  }

  selectMovie(m: MoviePick) {
    this.selectedMovie = m;
    this.form.patchValue({ movieId: m.tmdbMovieId });
    this.searchResults = [];
  }

  submit() {
    if (this.form.invalid || !this.selectedMovie) return;

    this.community.postReview(this.form.getRawValue()).subscribe(() => {
      this.closeCreate();
      this.loadReviews();
    });
  }
}
