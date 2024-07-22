import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Leaderboards, ContestScore } from '../../models/leaderboards.model';
import { LeaderboardsService } from '../../services/leaderboards.service';
import { throwError } from 'rxjs';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { ProgressBarMode, MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-overall-ranking',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    LoadingBarHttpClientModule
  ],
  templateUrl: './overall-ranking.component.html',
  styleUrl: './overall-ranking.component.scss'
})
export class OverallRankingComponent implements OnInit, OnDestroy {

    public leaderboards_list: Leaderboards[] = [];
    public contest_municipality_results: ContestScore[] = [];
    public load_bar_mode:ProgressBarMode = 'indeterminate';
    public isLoading = true;
    public contestResultsLoading = true;
    public isExpanded = false;
    private polling: any;

    constructor(private leaderboardsService: LeaderboardsService) {}

    ngOnInit(): void {
      this.getRanking();
      this.polling = setInterval(() => {
        this.getRanking();
      }, 1800000);
    }

    getRanking(): void {
      this.isLoading = true;
      this.leaderboardsService.loadLeaderboard().subscribe(
        {
          next: (res) => {
            this.leaderboards_list = res;
          },
          complete: () => {
            this.isLoading = false;
          },
          error: (err) => {
            return throwError(() => err);
          }
        }
      )
    }

    toggleCollapse(item: any, i:number) {

      this.leaderboards_list.map((el:any, index:number) => {
        if (index === i) {
          el.isOpen = true; 
        } else {
          el.isOpen = false;
        }
      })
      this.contestResultsLoading = true;
      this.leaderboardsService.getContestResult(item.s_munic).subscribe(
        {
          next: (res) => {
            this.contest_municipality_results = res;
          },
          complete: () => {
            this.contestResultsLoading = false;
          },
          error: (err) => {
            return throwError(() => err);
          }
        }
      )


    }

    ngOnDestroy(): void {
      clearInterval(this.polling);
    }
}
