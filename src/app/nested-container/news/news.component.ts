import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { News } from '../../models/news.model';
import { NewsService } from '../../services/news.service';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { ProgressBarMode, MatProgressBarModule } from '@angular/material/progress-bar';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    LoadingBarHttpClientModule
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {

  public news_list: News[] = [];
  public load_bar_mode:ProgressBarMode = 'indeterminate';
  public isLoading = true;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.loadNews().subscribe(
      {
        next: (res) => {
          this.news_list = res;

          this.news_list.map(el => {
            let image_file = el.news_cover_img;
            let final_url = API_URL+"public/files/news/"+image_file;
            el.news_cover_img = final_url;
          });

          console.log(this.news_list);

        },
        complete: () => {
          this.isLoading = false;
        },
        error: (err) => {
          return throwError(() => err);
        }
      }
    );
  }

}
