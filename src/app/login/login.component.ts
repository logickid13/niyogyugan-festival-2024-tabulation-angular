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
    isLoggedInCheck?: Subscription;

    constructor(
      public formBuilder: FormBuilder,
      private authService: AuthenticateService,
      private router: Router,
    ) {
    }

    ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
        username: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
        password: [null, Validators.required]
      });

      this.loginForm.markAllAsTouched();
    }

    login(): void {
      this.loginData = this.loginForm.value;
      let loginDatatoServer: any = this.loginData;
      
      console.log(loginDatatoServer);

    }

    get getControl(): any  {
      return this.loginForm.controls;
    }

    ngOnDestroy(): void {
      if (this.isLoggedInCheck) {
        this.isLoggedInCheck.unsubscribe();
      }
    }
}
