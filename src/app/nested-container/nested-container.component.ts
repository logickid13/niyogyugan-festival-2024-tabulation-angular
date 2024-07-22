import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nested-container',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './nested-container.component.html',
  styleUrl: './nested-container.component.scss'
})
export class NestedContainerComponent implements OnInit {

  public current_date:any = new Date().toISOString().slice(0, 10);
  public leaderboard_link_appear = false;

  constructor() {}

  ngOnInit(): void {

    if (this.current_date === "2024-08-09") {
      this.leaderboard_link_appear = false;
    } else {
      this.leaderboard_link_appear = true;
    }

  }
}
