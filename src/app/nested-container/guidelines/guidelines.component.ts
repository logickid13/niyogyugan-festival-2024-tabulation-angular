import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Guidelines } from '../../models/guidelines.model';
import { GuidelinesService } from '../../services/guidelines.service';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { ProgressBarMode, MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ViewActivityGuidelineComponent } from '../../dialog/view-activity-guideline/view-activity-guideline.component';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-guidelines',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatIconModule,
    MatDialogModule,
    LoadingBarHttpClientModule,
    ViewActivityGuidelineComponent
  ],
  templateUrl: './guidelines.component.html',
  styleUrl: './guidelines.component.scss'
})
export class GuidelinesComponent implements OnInit {

  public guidelines_list: Guidelines[] = [];
  public load_bar_mode:ProgressBarMode = 'indeterminate';
  public isLoading = true;

  constructor(
    private guidelinesService: GuidelinesService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {

    this.guidelinesService.loadGuidelines().subscribe(
      {
        next: (res) => {
          this.guidelines_list = res;

          this.guidelines_list.map(el => {
            let image_file = el.a_icon;
            let guidelines_file = el.a_guidelines;

            let final_url = API_URL+"api/public/files/list-of-activities-icons/"+image_file;
            let final_guidelines_url = API_URL+"api/public/files/guidelines/"+guidelines_file;

            el.a_icon = final_url;
            el.a_guidelines = final_guidelines_url;
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


  viewGuideline(item: any): void {
    // console.log(item);
    let view_guideline_dialog = this.dialog.open(ViewActivityGuidelineComponent, {
      data: {
        a_id: item.a_id,
        c_id: item.c_id,
        c_name: item.c_name,
        a_guidelines: item.a_guidelines,
      },
      height: '720px',
      width: '1080px',
      maxWidth: '100%'
    });

    view_guideline_dialog.afterClosed().subscribe(res => {
        console.log('dialog closed');
    });
  }
}
