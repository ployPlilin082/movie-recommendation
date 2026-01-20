import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommunityService } from '../../../../services/CommunityService';

@Component({
  selector: 'app-discussions-tab',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './discussions-tab.component.html',
  styleUrl: './discussions-tab.component.css'
})
export class DiscussionsTabComponent {

  @Input() discussions: any[] = [];
  newText = '';

  constructor(private community: CommunityService) {}

  create() {
    if (!this.newText.trim()) return;

    this.community.createDiscussion(this.newText)
      .subscribe(() => {
        this.newText = '';
        this.community.getDiscussions()
          .subscribe(r => this.discussions = r);
      });
  }
}
