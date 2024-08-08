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
  ) {}
  
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
      // height: '300px'  // Set the height of the dialog
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
