import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';
import { ScoringService } from '../../services/scoring.service';
import { MunicipalitiesAutocomplete, ContestsAutocomplete, GetCurrentScore } from '../../models/scoring.model';
import { Observable, throwError, startWith, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-scoring',
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
    MatProgressBarModule
  ],
  templateUrl: './scoring.component.html',
  styleUrl: './scoring.component.scss'
})
export class ScoringComponent implements OnInit {

    public findScoreForm!: FormGroup;
    public findScoreFormData!: GetCurrentScore;
    public currentScoreForm!: FormGroup;
    private municipalities: MunicipalitiesAutocomplete[] = [];
    private contests: ContestsAutocomplete[] = [];
    public filteredMunicipalities!: Observable<MunicipalitiesAutocomplete[]>;
    public filteredContests!: Observable<ContestsAutocomplete[]>;
    public load_bar_mode:ProgressBarMode = 'indeterminate';
    public isLoading = false;

    constructor(
      public formBuilder: FormBuilder,
      private scoringService: ScoringService,
      private toastrService: ToastrService
    ) {}


    ngOnInit(): void {
      this.findScoreForm = this.formBuilder.group({
        municipality_name: [null, [Validators.required]],
        contest_name: [null, Validators.required],
        municipality_id: [null],
        contest_id: [null]
      });

      this.currentScoreForm = this.formBuilder.group({
        rec_id: [null],
        current_score: [null],
        score_to_be_added: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
        municipality: [null],
        contest: [null]
      });

      this.scoringService.loadReferences().subscribe({
        next: (res) => {
          this.municipalities = res[0];
          this.contests = res[1];

          this.filteredMunicipalities = this.findScoreForm.get('municipality_name')!.valueChanges.pipe(                    
            startWith(''),
            map(value => this.filterMunicipalities(value))
          );

          this.filteredContests = this.findScoreForm.get('contest_name')!.valueChanges.pipe(                    
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
      this.findScoreForm.patchValue({
        municipality_id: m.munic_id
      }, {
        emitEvent: false, 
        onlySelf: true
      })

      this.currentScoreForm.patchValue({
        municipality: m.munic_name
      }, {
        emitEvent: false, 
        onlySelf: true
      })

    }

    onContestSelect(e: any, c: any) {
      this.findScoreForm.patchValue({
        contest_id: c.c_id
      }, {
        emitEvent: false, 
        onlySelf: true
      })

      this.currentScoreForm.patchValue({
        contest: c.c_name
      }, {
        emitEvent: false, 
        onlySelf: true
      })
    }

    get getControl(): any  {
      return this.findScoreForm.controls;
    }

    get getCurrentScoreFormControl(): any {
      return this.currentScoreForm.controls;
    }

    getCurrentScore(): void {
      this.isLoading = true;
      this.findScoreFormData = this.findScoreForm.value;
      
      this.scoringService.getCurrentScore(this.findScoreFormData).subscribe({
        next: (res) => {
          
          this.currentScoreForm.patchValue({
            rec_id: res[0].s_id,
            current_score: res[0].s_score
          }, {
            emitEvent: false, 
            onlySelf: true
          })

        },
        complete: () => {
          this.isLoading = false;
        },
        error: (err) => {
          return throwError(() => err);
        }
      })

    }

    addToCurrentScore(): void {
      let data = this.currentScoreForm.value;

      this.scoringService.addToCurrentScore(data).subscribe({
        next: (res) => {
          if (res[0].status == 'fail') {
            this.toastrService.warning('Score Not Updated', '', {
              progressBar: true,
              timeOut: 2000
            });
          } else if (res[0].status == 'success') {
            this.toastrService.success('Score Updated', '', {
              progressBar: true,
              timeOut: 2000
            });

            // clear current score form
            this.currentScoreForm.patchValue({
              rec_id: null,
              current_score: null,
              score_to_be_added: null,
              municipality: null,
              contest: null
            }, {
              emitEvent: false, 
              onlySelf: true
            })

            // clear search form
            this.findScoreForm.patchValue({
              municipality_name: null,
              contest_name: null,
              municipality_id: null,
              contest_id: null
            }, {
              emitEvent: false, 
              onlySelf: true
            })


          }
        },
        error: (err) => {
          return throwError(() => err);
        }
      });

    }


}
