import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GuidelinesService } from '../../services/guidelines.service';
import { throwError } from 'rxjs';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-view-activity-guideline',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    NgxExtendedPdfViewerModule
  ],
  templateUrl: './view-activity-guideline.component.html',
  styleUrl: './view-activity-guideline.component.scss'
})
export class ViewActivityGuidelineComponent implements OnInit {

    public a_id = "";
    public c_id = "";
    public c_name = "";
    public a_guidelines = "";
    public file_src!: Blob;
    public redirectPage!: number;

    constructor(
      @Inject(MAT_DIALOG_DATA) public data:any,
      public dialogRef: MatDialogRef<ViewActivityGuidelineComponent>,
      private guidelinesService: GuidelinesService
    ) {
      
    }

    ngOnInit(): void {
      this.a_id = this.data.a_id;
      this.c_id = this.data.c_id;
      this.c_name = this.data.c_name;
      this.a_guidelines = this.data.a_guidelines;

      switch (this.c_name) {
        case "Ginoong Niyogyugan":
          this.redirectPage = 1;
        break;
        case "Binibining Niyogyugan":
          this.redirectPage = 1;
        break;
        case "Cocolympics - Coco Relay":
            this.redirectPage = 3;
        break;
        case "Cocolympics - Lambanog Relay":
            this.redirectPage = 42;
        break;
        case "Cocolympics - Game Ka Na Ba?":
            this.redirectPage = 24;
        break;
        case "Cocolympics - Cooking Contest":
            this.redirectPage = 12;
        break;
        case "Cocolympics - Bangus Deboning":
            this.redirectPage = 33;
        break;
        case "CocoZumba Dance Contest":
            this.redirectPage = 1;
        break;
        case "Old Photo Contest":
          this.redirectPage = 1;
        break;
        case "Painting Contest - Watercolor":
          this.redirectPage = 1;
        break;
        case "Painting Contest - Acrylic":
          this.redirectPage = 1;
        break;
        case "Declamation Contest - Elementary":
          this.redirectPage = 1;
        break;
        case "Oration Contest - High School":
          this.redirectPage = 1;
        break;
        case "Oration Contest - College":
          this.redirectPage = 1;
        break;
        case "Madulang Sabayang Pagbigkas":
          this.redirectPage = 1;
        break;
        case "Tagayan Dance Ritual Contest":
          this.redirectPage = 1;
        break;
        case "Lambanog Mixology":
          this.redirectPage = 1;
        break;
        case "Tagisan ng Talino - MLQ Quiz Bee - Elementary":
          this.redirectPage = 1;
        break;
        case "Tagisan ng Talino - MLQ Quiz Bee - Junior High School":
          this.redirectPage = 1;
        break;
        case "Tagisan ng Talino - MLQ Quiz Bee - Senior High School":
          this.redirectPage = 1;
        break;
        case "Agri-tourism Booth Competition":
          this.redirectPage = 1;
        break;
        case "Float Competition":
          this.redirectPage = 1;
        break;
        case "Niyogyugan Dance Showdown Competition":
          this.redirectPage = 1;
        break;
        default:
            this.redirectPage = 1;
        break;
      }

      this.guidelinesService.getFileAsBlob(this.a_guidelines).subscribe(
        {
          next: (res) => {
            this.file_src = res;

            
          },
          error: (err) => {
            return throwError(() => err);
          }
        }
      )
    }

    closeDialog(): void {
		  this.dialogRef.close('dialog closed!');
	  }
}
