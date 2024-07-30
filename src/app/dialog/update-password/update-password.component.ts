import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticateService } from '../../services/authenticate.service';
import { UpdatePassword } from '../../models/login.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss'
})
export class UpdatePasswordComponent implements OnInit {

  public uid = "";
  public changePasswordForm!: FormGroup;
  public changePasswordData! :UpdatePassword; // to be sent to server
  public showNewPassword: boolean = false;
  public showNewConfirmPassword: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<UpdatePasswordComponent>,
    public authService: AuthenticateService,
    public toastrService: ToastrService,
    public formBuilder: FormBuilder
  ) {}


  ngOnInit(): void {
    this.uid = this.data.uid;

    this.changePasswordForm = this.formBuilder.group({
        uid: [this.uid],
        password: [null, [Validators.required]],
        confirm_password: [null, Validators.required]
    });
  }

  get getControl(): any  {
    return this.changePasswordForm.controls;
  }

  public toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  public toggleNewConfirmPasswordVisibility(): void {
    this.showNewConfirmPassword = !this.showNewConfirmPassword;
  }

  closeDialog(): void {
    this.dialogRef.close('dialog closed!');
  }

  onSubmit(): void  {
    if (this.changePasswordForm.value.password !== this.changePasswordForm.value.confirm_password) {
      this.toastrService.warning('Password Not Matched', '', {
        progressBar: true,
        timeOut: 2000
      });
    } else {
      this.changePasswordData = this.changePasswordForm.value;
      // let changePasswordtoServer: any = this.changePasswordData;
      // console.log(changePasswordtoServer);

      this.authService.updatePassword(this.changePasswordData).subscribe(
        {
          next: (res) => {
            if (res[0].status === 'fail') {
		        	this.toastrService.error('Password Update Failed!', '', {
		          		progressBar: true,
		          		timeOut: 2000
		        	});
		      	} else if (res[0].status === 'success') {
		        	this.toastrService.success('Password Updated!', '', {
		          		progressBar: true,
		          		timeOut: 2000
		        	});		
		        	this.dialogRef.close('dialog closed!');        
		      	} else {
		        	this.toastrService.warning('Invalid Transaction!', '', {
		          		progressBar: true,
		          		timeOut: 2000
		        	});
		      	}
          },
          error: (err) => {
            if (err.status == 403) {
              this.dialogRef.close('dialog closed!');
              this.toastrService.error('Account Not Permitted!', '', {
                progressBar: true,
                timeOut: 2000
              });
            }
          }
        }
      );
    }
  
  }
}
