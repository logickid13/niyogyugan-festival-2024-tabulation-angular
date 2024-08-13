import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NewAccountComponent } from '../../dialog/new-account/new-account.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FloatService } from '../../services/float.service';

@Component({
  selector: 'app-float-confirmation-dialog',
  standalone: true,
  imports:  [
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
  templateUrl: './float-confirmation-dialog.component.html',
  styleUrl: './float-confirmation-dialog.component.scss'
})
export class FloatConfirmationDialogComponent {

  public voterForm!: FormGroup;
  formData: any;
  
  townSubscription!: Subscription;

  constructor(
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FloatConfirmationDialogComponent>,
    private floatService: FloatService,
    @Inject(MAT_DIALOG_DATA) public paramData: any
  ) {}

  ngOnInit(): void {
    this.voterForm = this.formBuilder.group({
      fullname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]], // email
      mobileno: ["", [Validators.required, mobileNumberValidator()]], // max 11 numbers only
      address: ["", Validators.required],
      facebook: ["", Validators.required],
      municipalitySelections: this.formBuilder.array(this.paramData.votes),
      agree_to_terms_and_conditions: [false, checkboxRequiredValidator()]
    });
  }

  get getControl():any {
    return this.voterForm.controls;
  }

  get getTownsFormArray():any {
    return (this.getControl.municipalitySelections  as FormArray);
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        // control.markAsTouched();
        control.markAllAsTouched();
      }
    });
  }

  onSubmit(): void {
    const formData = this.voterForm.value;
    console.log(formData);
    
    if (this.voterForm.valid) {
      this.floatService.insertVote(formData).subscribe({
        next: (res) => {
          const status = res[0].status;

          if (status == 'fb_profile_has_record') {
            // this.dialogRef.close('fail');
            this.snackBar.open('Facebook account has been recorded!', 'Close', {
              duration: 2000,
            });
          }else if(status == 'success'){
            this.dialogRef.close('success');
            this.snackBar.open('Facebook account has been recorded!', 'Close', {
              duration: 2000,
            });
          }
          // console.log(res);
          // this.dialogRef.close(this.voterForm.value);
        },
        error: (err) => {
          if (err.status == 403) {
            this.dialogRef.close('dialog closed!');
            this.snackBar.open('Account Not Permitted', 'Close', {
              duration: 2000,
            });
          }
        }
      });
    } else {
      this.markFormGroupTouched(this.voterForm);
      this.snackBar.open('Please fill out all required fields', 'Close', {
        duration: 3000,
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.townSubscription) {
      this.townSubscription.unsubscribe();
    }
  }
}

// Custom validator function
export function checkboxRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    // Return null if the control's value is true
    return control.value ? null : { 'checkboxRequired': true };
  };
}

export function mobileNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = /^[0-9]{11}$/.test(control.value);
    return isValid ? null : { 'mobileNumberInvalid': { value: control.value } };
  };
}
