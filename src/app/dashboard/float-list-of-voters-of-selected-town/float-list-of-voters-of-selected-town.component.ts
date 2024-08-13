import { Component } from '@angular/core';
import { FloatService } from '../../services/float.service';
import * as XLSX from 'xlsx';
import { throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

interface Voter {
  fullname: string;
  email: string;
  mobileno: string;
  fb_profile: string;
  v_address: string;
}

interface TownData {
  town: string;
  voters: Voter[];
}

@Component({
  selector: 'app-float-list-of-voters-of-selected-town',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './float-list-of-voters-of-selected-town.component.html',
  styleUrls: ['./float-list-of-voters-of-selected-town.component.scss']
})
export class FloatListOfVotersOfSelectedTownComponent {
  downloadVotersDataLink!: string;

  constructor(private floatService: FloatService) {
    this.downloadVotersDataLink = floatService.downloadVotersDataLink();
    // this.exportVotersDataToExcel();
  }

  exportVotersDataToExcel() {
    this.floatService.votersData().subscribe({
      next: (res: unknown) => {
        // Type assertion to ensure `res` is treated as `TownData[]`
        const data = res as TownData[];

        if (!Array.isArray(data)) {
          console.error('Data should be an array');
          return;
        }

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // // Add a sheet for each town
        // data.forEach((townData: TownData) => {
        //   const ws = XLSX.utils.json_to_sheet(townData.voters);
        //   XLSX.utils.book_append_sheet(wb, ws, townData.town);
        // });

        // Add a sheet for each town
        data.forEach((townData: TownData) => {
          let ws;
          const town_name = townData.town;
          if (townData.voters.length === 0) {
            // Create a sheet with a message for towns with no voters
            ws = XLSX.utils.json_to_sheet([{ town_name: 'No votes for this town' }]);
          } else {
            // Create a sheet with voter data
            ws = XLSX.utils.json_to_sheet(townData.voters);
          }

          // Append the sheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, townData.town);
        });

        // Write the workbook and trigger download
        XLSX.writeFile(wb, 'VotersData.xlsx');
      },
      error: (err) => {
        console.error('Error fetching data', err);
        return throwError(() => err);
      }
    });
  }
}
