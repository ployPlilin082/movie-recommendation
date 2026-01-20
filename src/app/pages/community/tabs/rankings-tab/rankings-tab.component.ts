import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMovie } from '../../../../services/CommunityService';

@Component({
  selector: 'app-rankings-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rankings-tab.component.html',
  styleUrl: './rankings-tab.component.css'
})
export class RankingsTabComponent {

  @Input() topMovies: TopMovie[] = [];

}
