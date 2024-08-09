import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FLOATPARTICIPANTS } from '../../models/float-participants';
import { log } from 'console';
import { Subscription } from 'rxjs';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NewAccountComponent } from '../../dialog/new-account/new-account.component';
import { FloatConfirmationDialogComponent } from '../float-confirmation-dialog/float-confirmation-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-float-votes-choices',
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
    NewAccountComponent,
    MatSnackBarModule
  ],
  templateUrl: './float-votes-choices.component.html',
  styleUrl: './float-votes-choices.component.scss'
})
export class FloatVotesChoicesComponent implements OnInit {
  
  public voterForm!: FormGroup;

  countDownTime = {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  };

  private targetDate = new Date('August 16, 2024 08:00:00 GMT+8').getTime();

  targetDateStart = new Date('August 16, 2024 08:00:00 GMT+8');
  targetDateEnd   = new Date('August 17, 2024 16:00:00 GMT+8');
  currentDate     = new Date();
  showCountdown: boolean = false;
  showVoting:    boolean = false;
  showStopped:   boolean = false;

  townsToKeep = [
    "POLILLO", "UNISAN", "CALAUAG", "ATIMONAN", "LUCBAN", "PANUKULAN",
    "CATANAUAN", "SAN FRANCISCO", "GENERAL LUNA", "ALABAT", "GUMACA",
    "MULANAY", "MAUBAN", "TIAONG", "SARIAYA", "LOPEZ", "TAYABAS CITY",
    "PAGBILAO", "QUEZON", "GENERAL NAKAR", "CANDELARIA", "JOMALIG",
    "REAL", "GUINAYANGAN", "PEREZ"
  ];

  municipalitySelectionsSET: any[] = FLOATPARTICIPANTS.filter(participant => 
    this.townsToKeep.includes(participant.town)
  );

  townSubscription!: Subscription;
  formData: any;

  constructor(
    public formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.updateDisplay();
    setInterval(() => {
      this.currentDate = new Date();
      this.updateDisplay();
    }, 1000); // Update every second

    this.startCountdown();
  }

  private startCountdown(): void {
    setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const timeDiff = this.targetDate - now;

    if (timeDiff < 0) {
      this.countDownTime = {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      };
      return;
    }

    const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeDiff % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (60 * 1000)) / 1000);

    this.countDownTime = {
      days: days < 10 ? `0${days}` : `${days}`,
      hours: hours < 10 ? `0${hours}` : `${hours}`,
      minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      seconds: seconds < 10 ? `0${seconds}` : `${seconds}`
    };
  }

  updateDisplay(): void {
    if (this.currentDate < this.targetDateStart) {
      this.showCountdown = true;
      this.showVoting = false;
      this.showStopped = false;
    } else if (this.currentDate >= this.targetDateStart && this.currentDate <= this.targetDateEnd) {
      this.showCountdown = false;
      this.showVoting = true;
      this.showStopped = false;
    } else {
      this.showCountdown = false;
      this.showVoting = false;
      this.showStopped = true;
    }
  }

  getCountdown(): string {
    const timeDiff = this.targetDateStart.getTime() - this.currentDate.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  
  ngOnInit(): void {
    this.voterForm = this.formBuilder.group({
      municipalitySelections: this.formBuilder.array(
        this.municipalitySelectionsSET.map(() => false),
        this.maxSelectedCheckboxesValidator(3) // Apply the custom validator
      ),
    });
    // console.log(this.municipalitySelections);

    this.townSubscription = this.getTownsFormArray.valueChanges.subscribe((checkbox: any) => {
      this.getTownsFormArray.setValue(
        this.getTownsFormArray.value.map((value:any, i:number) => 
          value ? this.municipalitySelectionsSET[i].town : false
        ),
        { emitEvent: false }
      );
      // this.getFinalForm();
    });
  }

  get getControl():any {
    return this.voterForm.controls;
  }

  get getTownsFormArray():any {
    return (this.getControl.municipalitySelections  as FormArray);
  }

  // Validator function to limit the number of selected checkboxes
  maxSelectedCheckboxesValidator(max: number): ValidatorFn {
    return (formArray: AbstractControl): {[key: string]: boolean} | null => {
      if (!(formArray instanceof FormArray)) {
        return null; // Return null if control is not a FormArray
      }

      const selectedCount = formArray.controls.filter(control => control.value).length;
      if (selectedCount > max) {
        return { maxSelected: true }; // Return error object if validation fails
      }
      return null; // Return null if validation is successful
    };
  }

  openDialog(action: string, selectionArray: any[]): void {
    // console.log(action);
    // console.log(selectionArray);
    
    const dialogRef = this.dialog.open(FloatConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to proceed?',
        action: action,
        votes: selectionArray
      },
      width: '500px',  // Set the width of the dialog
      height: '800px', // Set the height of the dialog
      panelClass: 'scrollable-dialog' // Add a custom CSS class
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
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

  /**
   * getFinalForm
   */
   public getFinalForm() {
    const checkboxControl = this.getTownsFormArray;

    const permissionsSet = checkboxControl.value.filter((value: any) => !!value);

    const formValue = {
      ...this.voterForm.value,
      permissions: checkboxControl.value.filter((value: any) => !!value),
    };

    console.log(formValue);
  }

  selectionArray(){
    const checkboxControl = this.getTownsFormArray;
    const selectionArray = checkboxControl.value.filter((value: any) => !!value);

    return selectionArray;
  }

   public validateSelected() {
    const checkboxControl = this.getTownsFormArray;

    const selectedLenght = checkboxControl.value.filter((value: any) => !!value);

    if (selectedLenght.length > 3) {
      const action = 'vote_exceeded';
      this.openDialog(action, this.selectionArray());
    }
    else if (selectedLenght.length == 0) {
      const action = 'vote_not_found';
      this.openDialog(action, this.selectionArray());
    }else{
      const action = 'proceed';
      this.openDialog(action, this.selectionArray());
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }
}
