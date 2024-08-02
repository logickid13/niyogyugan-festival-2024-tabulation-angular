import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { ConsolationService } from '../../services/consolation.service';
import { MunicipalitiesAutocomplete, ContestsAutocomplete, UpdateConsolationFinalScores } from '../../models/consolation.model';
import { Observable, throwError, startWith, map, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthenticateService } from '../../services/authenticate.service';

@Component({
  selector: 'app-consolation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule
  ],
  templateUrl: './consolation.component.html',
  styleUrl: './consolation.component.scss'
})
export class ConsolationComponent implements OnInit, OnDestroy {

    @ViewChild('consolation_munic_table', {static: false}) consolation_munic_table!: MatTable<any>;
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    public displayedColumns: string[] = ['municipality','contest','action'];

    public appendForm!: FormGroup;
    public appendFormData!: UpdateConsolationFinalScores;
    private municipalities: MunicipalitiesAutocomplete[] = [];
    private contests: ContestsAutocomplete[] = [];
    public filteredMunicipalities!: Observable<MunicipalitiesAutocomplete[]>;
    public filteredContests!: Observable<ContestsAutocomplete[]>;
    public load_bar_mode:ProgressBarMode = 'indeterminate';
    public isLoading = false;
    main_permission: number[] = [];
    current_permission_observable!: Subscription;

    constructor(
      public formBuilder: FormBuilder,
      private consolationService: ConsolationService,
      private toastrService: ToastrService,
      private authService: AuthenticateService
    ) {}

    ngOnInit(): void {

      this.current_permission_observable = this.authService.accountPermissionOb().subscribe(val => {
        this.main_permission = val;
      });

      this.appendForm = this.formBuilder.group({
        municipality_name: [null, [Validators.required]],
        contest_name: [null, Validators.required],
        municipality_id: [null],
        contest_id: [null],
        munic_arr: this.formBuilder.array([]),
        score_to_be_added: [null, [Validators.required, Validators.pattern("^[0-9]*$")]]
      });

      this.dataSource = new MatTableDataSource(this.getArrayControl.controls);

      this.consolationService.loadReferences().subscribe({
        next: (res) => {
          this.municipalities = res[0];
          this.contests = res[1];
  
          this.filteredMunicipalities = this.appendForm.get('municipality_name')!.valueChanges.pipe(                    
            startWith(''),
            map(value => this.filterMunicipalities(value))
          );
  
          this.filteredContests = this.appendForm.get('contest_name')!.valueChanges.pipe(                    
            startWith(''),
            map(value => this.filterContests(value))
          );
        },
        error: (err) => {
          return throwError(() => err);
        }
      })
      
    }

    filterMunicipalities(value:string): MunicipalitiesAutocomplete[] {
      const filterValue = value.toLowerCase();
      return this.municipalities.filter(option => option.munic_name.toLowerCase().includes(filterValue))
    }

    filterContests(value:string): ContestsAutocomplete[] {
      const filterValue = value.toLowerCase();
      return this.contests.filter(option => option.c_name.toLowerCase().includes(filterValue))
    }

    onMunicipalitySelect(e: any, m: any) {
      this.appendForm.patchValue({
        municipality_id: m.munic_id
      }, {
        emitEvent: false, 
        onlySelf: true
      })

    }

    onContestSelect(e: any, c: any) {
      this.appendForm.patchValue({
        contest_id: c.c_id
      }, {
        emitEvent: false, 
        onlySelf: true
      })
    }

    get getControl(): any  {
      return this.appendForm.controls;
    }

    get getArrayControl(): any {
      const control = this.appendForm.get('munic_arr') as FormArray;
		  return control;
    }

    addToTable() {
      // console.log(this.getArrayControl);

      if (
        (this.appendForm.value.municipality_name == null || this.appendForm.value.municipality_name == "") && 
        (this.appendForm.value.contest_name == null || this.appendForm.value.contest_name == "")
      ) {
        this.toastrService.warning('Please fill the inputs of Municipality/City Name and Contest Name!', '', {
          progressBar: true,
          timeOut: 2000
        });		
      } else {
        let filter_arr = this.appendForm.value.munic_arr.filter((el: any) => {
          return (el.municipality == this.appendForm.value.municipality_name) && (el.contest == this.appendForm.value.contest_name)
        });
  
        if (filter_arr.length > 0) {
          this.toastrService.warning('Duplicates not Allowed!', '', {
            progressBar: true,
            timeOut: 2000
          });		
        } else {
          this.getArrayControl.push(this.formBuilder.group({
            municipality_id: new FormControl(this.appendForm.value.municipality_id),
            municipality: new FormControl(this.appendForm.value.municipality_name),
            contest_id: new FormControl(this.appendForm.value.contest_id),
            contest: new FormControl(this.appendForm.value.contest_name)
          }));
    
          this.consolation_munic_table.renderRows();
        }
      }

    }

    deleteRow(i: number) {
      if (confirm('Are you sure you want to remove this data?')) {
        this.getArrayControl.removeAt(i);

        this.dataSource.data = this.dataSource.data;
        this.consolation_munic_table.renderRows();
      }
      
    }

    updateConsolationScores(): void {
      this.appendForm.value.munic_arr = JSON.stringify(this.appendForm.value.munic_arr);
      this.appendFormData = this.appendForm.value;
      
      this.consolationService.updateConsolationScores(this.appendFormData).subscribe({
        next: (res) => {
          if (res[0].status == 'fail') {
            this.toastrService.warning('Consolation Scores Not Updated', '', {
              progressBar: true,
              timeOut: 2000
            });
          } else if (res[0].status == 'success') {
            this.toastrService.success('Consolation Scores Updated', '', {
              progressBar: true,
              timeOut: 2000
            });

            // clear table and forms
            this.getArrayControl.clear();
            this.dataSource.data = this.dataSource.data;
            this.consolation_munic_table.renderRows();

            this.appendForm.patchValue({
              municipality_name: null,
              contest_name: null,
              municipality_id: null,
              contest_id: null,
              score_to_be_added: null
            },
              {
                emitEvent: false,
                onlySelf: true
              }
            );

          }
        },
        error: (err) => {
          return throwError(() => err);
        }
      });
    }

    ngOnDestroy(): void {
      if (this.current_permission_observable) {
        this.current_permission_observable.unsubscribe();
      }
    }


}
