import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunityPost } from '../../../../services/CommunityService';

@Component({
  selector: 'app-reviews-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews-tab.component.html',
  styleUrl: './reviews-tab.component.css'
})
export class ReviewsTabComponent {

  @Input() posts: CommunityPost[] = [];
  @Input() comments!: Record<number, any[]>;
  @Input() commentDraft!: Record<number, string>;
  @Input() openCommentId!: number | null;

  @Output() like = new EventEmitter<CommunityPost>();
  @Output() share = new EventEmitter<CommunityPost>();
  @Output() toggleComment = new EventEmitter<number>();
  @Output() sendComment = new EventEmitter<number>();


 trackById(_: number, item: CommunityPost) {
  return item.postId;
}

}
