import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateFormatService } from '../../services/custom-date-format.service';
import { AuthenticateService } from '../../services/authenticate.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription, merge, Observable, throwError } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { ActivityLogs, TableParameters, QueryParameters, UsersListAutocomplete, ActionType } from '../../models/activity-logs.model';
import { ActivityLogsService } from '../../services/activity-logs.service';

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
      dateInput: 'input',
      monthYearLabel: { year: 'numeric', month: 'short' },
      dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
      monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateFormatService },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  ],
  templateUrl: './activity-logs.component.html',
  styleUrl: './activity-logs.component.scss'
})
export class ActivityLogsComponent implements OnInit, AfterViewInit, OnDestroy {

  isLoading = true;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  displayedColumns: string[] = ['timestamp', 'username', 'action'];
  action_list: ActionType[] = [];

  @ViewChild('activity_logs_tbl', {static: true}) activity_logs_tbl!: MatTable<any>;

  dataSource: MatTableDataSource<ActivityLogs> = new MatTableDataSource();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) 
  sort!: MatSort;

  // ServiceSubs: Subscription[] = []; // used on main service(isloggedin)
  SearchSubs: Subscription[] = [];
  public table_params!: TableParameters;
  public query: QueryParameters[] = [];
  public query_param: QueryParameters[] = [];
  public filterForm!: FormGroup;
  public filteredAccountOptions!: Observable<UsersListAutocomplete[]>;
  public users_arr: UsersListAutocomplete[] = [];

  constructor(
    private activityLogsService: ActivityLogsService,
    private router: Router,
    public formBuilder: FormBuilder,
    private authService: AuthenticateService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.action_list = [
      {
        action_id: 1,
        action_name: "LOGIN"
      },
      {
        action_id: 2,
        action_name: "LOGOUT"
      },
      {
        action_id: 3,
        action_name: "CREATE"
      },
      {
        action_id: 4,
        action_name: "UPDATE"
      },
      {
        action_id: 5,
        action_name: "DELETE"
      },
      {
        action_id: 6,
        action_name: "RESET"
      }
    ];

    this.filterForm = this.formBuilder.group({
      start_dt: [""],
      end_dt: [""],
      username: [""],
      action_type: [""]
    });

    this.activityLogsService.loadUsersAutocomplete().subscribe({
      next: (res) => {
        this.users_arr = res;

        this.filteredAccountOptions = this.filterForm.get('username')!.valueChanges.pipe(                    
          startWith(''),
          map(value => this.filterAccounts(value))
        );

      },
      error: (err) => {
        return throwError(() => err);
      }
    });

  }

  get getControl(): any  {
    return this.filterForm.controls;
  }

  filterAccounts(value:string): UsersListAutocomplete[] {
    const filterValue = value.toLowerCase();
    return this.users_arr.filter(option => option.username.toLowerCase().includes(filterValue) || option.fullname.toLowerCase().includes(filterValue))
  }

  resetFilterTable(): void {

    this.filterForm.patchValue(
      {
        start_dt: "",
        end_dt: "",
        username: "",
        action_type: ""
      }
    );
  }

  filter(): void {
    this.isLoading = true;
    this.paginator.pageIndex = 0;

    if (this.filterForm.value.start_dt !== "") {
      let date_from: any = new Date(new Date(this.filterForm.value.start_dt).getTime() - new Date(this.filterForm.value.start_dt).getTimezoneOffset()*60*1000).toISOString().substr(0,19).split(/[T ]/i, 1)[0];
      this.filterForm.value.start_dt = date_from;
    }

    if (this.filterForm.value.end_dt !== "") {
      let date_to: any = new Date(new Date(this.filterForm.value.end_dt).getTime() - new Date(this.filterForm.value.end_dt).getTimezoneOffset()*60*1000).toISOString().substr(0,19).split(/[T ]/i, 1)[0];
      this.filterForm.value.end_dt = date_to;
    }

    this.query_param = this.filterForm.value;
    this.query = this.query_param;

    // convert currentPage and pageSize to string from numbers
    this.table_params = { query: this.query, sort: this.sort.active, order: this.sort.direction, currentPage: String(this.paginator.pageIndex), pageSize: String(this.paginator.pageSize), rows: "", data: "", count: "" };
    this.activityLogsService.loadHistory(this.table_params)
    .subscribe({
      next: (res) => {
        this.isLoading = false;
        this.totalRows = res.rows.count;
        this.dataSource.data = res.rows.data;
      },
      error: (err) => {
        this.isLoading = false;
        return throwError(() => err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.SearchSubs = [];
    this.SearchSubs.push(
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0)),
       merge( 
       this.sort.sortChange, 
       this.paginator.page
      )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;


          if (this.filterForm.value.start_dt !== "") {
            let date_from: any = new Date(new Date(this.filterForm.value.start_dt).getTime() - new Date(this.filterForm.value.start_dt).getTimezoneOffset()*60*1000).toISOString().substr(0,19).split(/[T ]/i, 1)[0];
            this.filterForm.value.start_dt = date_from;
          }

          if (this.filterForm.value.end_dt !== "") {
            let date_to: any = new Date(new Date(this.filterForm.value.end_dt).getTime() - new Date(this.filterForm.value.end_dt).getTimezoneOffset()*60*1000).toISOString().substr(0,19).split(/[T ]/i, 1)[0];
            this.filterForm.value.end_dt = date_to;
          }

          this.query_param = this.filterForm.value;
          this.query = this.query_param;

          // convert currentPage and pageSize to string from numbers
          this.table_params = { query: this.query, sort: this.sort.active, order: this.sort.direction, currentPage: String(this.paginator.pageIndex), pageSize: String(this.paginator.pageSize), rows: "", data: "", count: "" };

          return this.activityLogsService.loadHistory(this.table_params)
          // return this.githubService
          //   .getRepoIssues(
          //     this.sort.active,
          //     this.sort.direction,
          //     this.paginator.pageIndex + 1,
          //     this.paginator.pageSize
          //   )
          //   .pipe(catchError(() => observableOf(null)));
        }),
        map(res => {
          // Flip flag to show that loading has finished.
          // console.log(data.rows.data);
          this.isLoading = false;

          if (res.rows.data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.totalRows = res.rows.count;
          return res.rows.data;
        })
      )
      .subscribe({
        next: (res) => {
          this.dataSource.data = res;
        },
        error: (err) => {
          return throwError(() => err);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.SearchSubs.forEach((serviceSub: Subscription) => {
      serviceSub.unsubscribe();
    });
    this.SearchSubs = [];
  }

}
