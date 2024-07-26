import { Component, AfterViewInit, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription, throwError } from 'rxjs';
import { delay, filter, skip } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthenticateService } from '../services/authenticate.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { Logout, UpdateProfilePic, BackendSessionCheck } from '../models/login.model';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { environment } from '../../environments/environment.development';
import { UpdateProfilePicComponent } from '../dialog/update-profile-pic/update-profile-pic.component';
import { UpdatePasswordComponent } from '../dialog/update-password/update-password.component';

const API_URL = environment.apiUrl;

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatExpansionModule,
    MatSlideToggleModule,
    LoadingBarHttpClientModule,
    UpdateProfilePicComponent,
    UpdatePasswordComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSidenav) public sidenav!: MatSidenav;
  public isLoggedIn = false;
  public isLoginFailed = false;
  public loginToggle = false;
  isLoggedSubs?: Subscription;
  sessionCheck?: Subscription;
  public display_fullname = "";
  public display_uid = "";
  public display_profile_pic = "";
  public display_permission:number[] = [];
  public img_url = API_URL+"files/profile-pic/";
  public current_profile_pic = "";

  constructor(
    private observer: BreakpointObserver, 
    private authService: AuthenticateService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {

    this.isLoginFailed = false;
    this.isLoggedIn = false;

    this.display_fullname = "";
    this.display_uid = "";
    this.display_profile_pic = "";
    this.display_permission = [];

    this.sessionCheck = this.authService.backendSessionCheck().subscribe({
      next: (res: BackendSessionCheck[]) => {
        if (res[0].status == 'no_session') {
  
          this.isLoginFailed = false;
          this.isLoggedIn = false;
  
          this.display_fullname = "";
          this.display_uid = "";
          this.display_profile_pic = "";
          this.display_permission = [];
          
          this.router.navigate(['/login']);
  
        } else if (res[0].status == 'currently_logged_in') {
  
          // reconnect to socket.io server if still logged-in on backendSessionCheck
          // this.socketService.connect();
  
          this.isLoginFailed = false;
          this.isLoggedIn = true;
  
          this.display_fullname = res[0].fullname;
          this.display_uid = res[0].uid;
          this.display_profile_pic = res[0].profile_pic;
          this.current_profile_pic = this.img_url+this.display_profile_pic;
          this.display_permission = JSON.parse(res[0].permission);
        } 
      },
      error: (err) => {
        return throwError(() => err);
      }
    })
  
    this.isLoggedSubs = this.authService.isLoggedSubject().pipe(skip(1)) // use this rxjs operator to skip the first false(not logged in so behaviorsubject initial value)
    .subscribe(
      {
        next: (res) => {
          if (res == false) {
            this.display_fullname = "";
            this.display_uid = "";
            this.display_profile_pic = "";
            this.display_permission = [];

            this.isLoginFailed = true;
            this.isLoggedIn = false;

          }
        },
        error: (err) => {
          return throwError(() => err);
        }
      }
    )
  }

  profilePICDialog() {
    let profile_pic_dialog = this.dialog.open(UpdateProfilePicComponent, {
      data: {
        uid: this.display_uid,
        profile_pic: this.display_profile_pic
      },
      height: '400px',
      width: '600px',
      disableClose: true
    });

    profile_pic_dialog.backdropClick().subscribe(result => {
      // Close the dialog
      // dialogRef.close();
      this.toastrService.warning('Clicking Outside is Disabled', '', {
        progressBar: true,
        timeOut: 2000
      });
    });

    profile_pic_dialog.afterClosed().subscribe((result: UpdateProfilePic) => {
      // console.log(result.response); // result from dialog component
      if (result.response == 'success') {
        this.display_profile_pic = result.profile_pic;
        this.current_profile_pic = this.img_url+this.display_profile_pic;
      }
    });
  }

  updatePasswordDialog() {
    let update_password_dialog = this.dialog.open(UpdatePasswordComponent, {
      data: {
        uid: this.display_uid
      },
      height: '400px',
      width: '600px',
      disableClose: true
    });

    update_password_dialog.backdropClick().subscribe(result => {
      // Close the dialog
      // dialogRef.close();
      this.toastrService.warning('Clicking Outside is Disabled', '', {
            progressBar: true,
            timeOut: 2000
          });
    });

    update_password_dialog.afterClosed().subscribe((result: any) => {
      console.log(result); // result from dialog component
    });
  }

  ngAfterViewInit(): void {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
    });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
    });
  }




  logout(): void {
    this.authService.logout().subscribe(
      {
        next: (res: Logout) => {

          if (res[0].status == "logout_success") {
            this.toastrService.info('Logged Out', '', {
              progressBar: true,
              timeOut: 3000
            });
  
            this.display_fullname = "";
            this.display_uid = "";
            this.display_profile_pic = "";
            this.display_permission = [];
            this.isLoginFailed = true;
            this.isLoggedIn = false;
  
            this.router.navigate(['/login']);
          }
          
        },
        error: (err) => {
          return throwError(() => err);
        }
      }
    )
  }

  ngOnDestroy(): void {
    if (this.isLoggedSubs) {
      this.isLoggedSubs.unsubscribe();
    }

    if (this.sessionCheck) {
      this.sessionCheck.unsubscribe();
    }
  }


}
