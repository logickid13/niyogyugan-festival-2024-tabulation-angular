import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, merge, throwError } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { AccountService } from '../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Account, TableParameters, QueryParameters, NewAccount } from '../../models/account.model';
import { AuthenticateService } from '../../services/authenticate.service';
import { NewAccountComponent } from '../../dialog/new-account/new-account.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    NewAccountComponent
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent implements OnInit, AfterViewInit, OnDestroy {

    isLoading = true;
    totalRows = 0;
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    displayedColumns: string[] = ['username', 'fullname', 'action'];
    filterToggle = false;
    current_permission_observable!: Subscription;
    current_permission: number[] = [];

    @ViewChild('accounts_tbl', {static: true}) accounts_tbl!: MatTable<any>;

    dataSource: MatTableDataSource<Account> = new MatTableDataSource();
    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    @ViewChild(MatSort) 
    sort!: MatSort;

    // ServiceSubs: Subscription[] = []; // used on main service(isloggedin)
    SearchSubs: Subscription[] = []; // used on main service(isloggedin)
    public table_params!: TableParameters;
    public query: QueryParameters[] = [];
    public query_param: QueryParameters[] = [];

    public filterForm!: FormGroup;

    constructor(
		  private accountService: AccountService,
    	public formBuilder: FormBuilder,
      private authService: AuthenticateService,
      private dialog: MatDialog,
      private toastrService: ToastrService
	) {}


    ngOnInit(): void {
      this.current_permission_observable = this.authService.accountPermissionOb().subscribe(val => {
        this.current_permission = val;
      });

      this.filterForm = this.formBuilder.group({
        username: [""],
        fullname: [""]
      });
    }

    get getFormControl(): any  {
      return this.filterForm.controls;
    }

    newAccount(): void {
      let new_account_dialog = this.dialog.open(NewAccountComponent, {
          height: '600px',
          width: '800px',
          disableClose: true
      });
  
      new_account_dialog.backdropClick().subscribe(result => {
          // Close the dialog
          // dialogRef.close();
          this.toastrService.warning('Clicking Outside is Disabled', '', {
            progressBar: true,
            timeOut: 2000
          });
      });
  
      new_account_dialog.afterClosed().subscribe((result: NewAccount) => {
          // console.log(result.response); // result from dialog component
          if (result.response == 'success') {
            this.reloadTable();
          } else {
            console.log(result);
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
  
            this.query_param = this.filterForm.value;
            this.query = this.query_param;
            
            // convert currentPage and pageSize to string from numbers
            this.table_params = { query: this.query, sort: this.sort.active, order: this.sort.direction, currentPage: String(this.paginator.pageIndex), pageSize: String(this.paginator.pageSize), rows: "", data: "", count: "" };
  
            return this.accountService.loadAccount(this.table_params)
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
      // If the user changes the sort order, reset back to the first page.
      // this.filterUsernameForm.valueChanges.pipe().subscribe(() => {
      //   this.paginator.pageIndex = 0;
      // });
  
    }

    reloadTable() {
      this.isLoading = true;
  
      this.query_param = this.filterForm.value;
      this.query = this.query_param;
  
      // convert currentPage and pageSize to string from numbers
      this.table_params = { query: this.query, sort: this.sort.active, order: this.sort.direction, currentPage: String(this.paginator.pageIndex), pageSize: String(this.paginator.pageSize), rows: "", data: "", count: "" };
  
      this.accountService.loadAccount(this.table_params).subscribe({
        next: (res) => {
          this.dataSource.data = res.rows.data;
          setTimeout(() => {
            // this.paginator.pageIndex = this.currentPage;
            this.totalRows = res.rows.count;
          });
          this.isLoading = false;
        },  
        error: (err) => {
          this.isLoading = false;
          return throwError(() => err);
        }
      });

    }

    resetFilterTable(): void {

      this.filterForm.patchValue(
      {
        username: "",
        fullname: ""
      }
      );
    }

    filter(): void {
      this.isLoading = true;
      this.paginator.pageIndex = 0;
      
      this.query_param = this.filterForm.value;
      this.query = this.query_param;
      
            
      // convert currentPage and pageSize to string from numbers
      this.table_params = { query: this.query, sort: this.sort.active, order: this.sort.direction, currentPage: String(this.paginator.pageIndex), pageSize: String(this.paginator.pageSize), rows: "", data: "", count: "" };
  
      this.accountService.loadAccount(this.table_params).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.dataSource.data = res.rows.data;
          setTimeout(() => {
            this.totalRows = res.rows.count;
          })
  
        },
        error: (err) => {
          this.isLoading = false;
          return throwError(() => err);
        }
      });
  
    }

    ngOnDestroy(): void {
      this.SearchSubs.forEach((serviceSub: Subscription) => {
        serviceSub.unsubscribe();
      });
      this.SearchSubs = [];
  
      if (this.current_permission_observable) {
        this.current_permission_observable.unsubscribe();
      }
    }
}
