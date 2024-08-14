import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';  // Import NgxChartsModule
import { FloatService } from '../../services/float.service';
import { throwError } from 'rxjs';
import { FloatStanding } from '../../models/consolation.model';

@Component({
  selector: 'app-float-current-standing-report',
  standalone: true,
  imports: [
    NgxChartsModule
  ],
  templateUrl: './float-current-standing-report.component.html',
  styleUrls: ['./float-current-standing-report.component.scss']
})
export class FloatCurrentStandingReportComponent implements OnInit {

  ranking: FloatStanding[] = [];
  barChartData: any[] = [];
  festiveColorScheme: any = {
    domain: ['#FF6347', '#FF4500', '#FFD700', '#32CD32', '#00BFFF', '#FF1493', '#FF69B4']
  };

  today: Date;

  constructor(private floatService: FloatService) { 
    this.today = new Date();
    this.loadStanding();
  }

  ngOnInit(): void { }

  loadStanding() {
    this.floatService.getRanking().subscribe({
      next: (res) => {
        this.ranking = res;
        this.prepareChartData();
      },
      error: (err) => {
        return throwError(() => err);
      }
    });
  }

  prepareChartData() {
    this.ranking.sort((a, b) => b.votes - a.votes);
    this.barChartData = this.ranking.map(item => ({
      name: item.town,
      value: item.votes
    }));
  }
}
