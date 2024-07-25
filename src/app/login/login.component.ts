import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { AuthenticateService } from '../services/authenticate.service';
import { Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { Login } from '../models/login.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

    public loginForm!: FormGroup;
    public loginData: Login[] = []; // to be sent to server
    isLogin = false;
    public response_status = '';
    public system_version = environment.appVersion;

    constructor(
      public formBuilder: FormBuilder,
      private authService: AuthenticateService,
      private router: Router,
      private toastrService: ToastrService
    ) {
    }

    ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
        username: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
        password: [null, Validators.required]
      });

      this.loginForm.markAllAsTouched();

      this.authService.backendSessionCheck().subscribe({
        next: (res) => {
          if (res[0].status == 'currently_logged_in') {
            this.router.navigate(['/dashboard/home']);
          } 
        },
        error: (err) => {
          return throwError(() => err);
        }
      })
    }

    login(): void {
      this.loginData = this.loginForm.value;
      let loginDatatoServer: any = this.loginData;
      
      this.authService.login(loginDatatoServer).subscribe({
        next: (res) => {
          this.response_status = res[0].status;

          if (this.response_status == 'logged_in') {

            // connect to socket.io server
            // this.socketService.connect();

            // redirect to dashboard
            this.router.navigate(['/dashboard/home']);
           
          } else if (this.response_status == 'password_fail') {

            this.toastrService.warning('Incorrect Password', '', {
              progressBar: true,
              timeOut: 2000
            });

          } else if (this.response_status == 'username_not_exist') {

            this.toastrService.warning('ID No. does not exist!', '', {
              progressBar: true,
              timeOut: 2000
            });

          } else if (this.response_status == 'account_inactive') {

            this.toastrService.warning('Account Inactive!', '', {
              progressBar: true,
              timeOut: 2000
            });

          } else if (this.response_status == 'attempt_limit_reached') {

            this.toastrService.warning('Please contact administrator to unlock account.', 'Login Attempt Limit Reached!', {
              progressBar: true,
              timeOut: 2000
            });

          } else if (this.response_status == 'invalid_transaction') {         

            this.toastrService.error('Invalid Transaction!', '', {
              progressBar: true,
              timeOut: 2000
            });

          }
        },
        error: (err) => {
          return throwError(() => err);
        }
      })

    }

    get getControl(): any  {
      return this.loginForm.controls;
    }

    ngOnDestroy(): void {
      
    }
}
