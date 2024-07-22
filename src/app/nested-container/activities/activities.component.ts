import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOfActivities } from '../../models/list-of-activities.model';
import { ListOfActivitiesService } from '../../services/list-of-activities.service';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { ProgressBarMode, MatProgressBarModule } from '@angular/material/progress-bar';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    LoadingBarHttpClientModule
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent implements OnInit {

  public list_of_activities: ListOfActivities[] = [];
  public load_bar_mode:ProgressBarMode = 'indeterminate';
  public isLoading = true;

  constructor(private listOfActivitiesService: ListOfActivitiesService) {}

  ngOnInit(): void {

      this.listOfActivitiesService.loadActivities().subscribe(
        {
          next: (res) => {
            this.list_of_activities = res;

            this.list_of_activities.map(el => {
              let image_file = el.a_icon;
              let final_url = API_URL+"api/public/files/list-of-activities-icons/"+image_file;
              el.a_icon = final_url;
            });

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

}
