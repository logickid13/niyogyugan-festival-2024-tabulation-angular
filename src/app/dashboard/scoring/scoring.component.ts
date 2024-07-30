import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ScoringService } from '../../services/scoring.service';
import { MunicipalitiesAutocomplete, ContestsAutocomplete } from '../../models/scoring.model';
import { Observable, throwError, startWith, map } from 'rxjs';

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
    MatAutocompleteModule
  ],
  templateUrl: './scoring.component.html',
  styleUrl: './scoring.component.scss'
})
export class ScoringComponent implements OnInit {

    public findScoreForm!: FormGroup;
    private municipalities: MunicipalitiesAutocomplete[] = [];
    private contests: ContestsAutocomplete[] = [];
    public filteredMunicipalities!: Observable<MunicipalitiesAutocomplete[]>;
    public filteredContests!: Observable<ContestsAutocomplete[]>;

    constructor(
      public formBuilder: FormBuilder,
      private scoringService: ScoringService
    ) {}


    ngOnInit(): void {
      this.findScoreForm = this.formBuilder.group({
        municipality_name: [null, [Validators.required]],
        contest_name: [null, Validators.required],
        municipality_id: [null],
        contest_id: [null]
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
      }
      )
    }

    onContestSelect(e: any, c: any) {
      this.findScoreForm.patchValue({
        contest_id: c.c_id
      }, {
        emitEvent: false, 
        onlySelf: true
      }
      )
    }

    get getControl(): any  {
      return this.findScoreForm.controls;
    }
}
