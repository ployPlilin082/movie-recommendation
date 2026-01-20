import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommunityService } from '../../../../services/CommunityService';

@Component({
  selector: 'app-events-tab',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './events-tab.component.html',
  styleUrl: './events-tab.component.css'
})
export class EventsTabComponent {

  @Input() events: any[] = [];

  title = '';
  description = '';
  startDate = '';
  endDate = '';

  constructor(private community: CommunityService) {}

  create() {
    if (!this.title || !this.startDate) return;

    this.community.createEvent({
      title: this.title,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate
    }).subscribe(() => {
      this.title = this.description = this.startDate = this.endDate = '';
      this.community.getEvents()
        .subscribe(r => this.events = r);
    });
  }
}
