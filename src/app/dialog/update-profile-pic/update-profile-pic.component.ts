import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxFileDropModule, NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { MatTableModule, MatTable } from '@angular/material/table';
import { AuthenticateService } from '../../services/authenticate.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.development';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-update-profile-pic',
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    NgxFileDropModule
  ],
  templateUrl: './update-profile-pic.component.html',
  styleUrl: './update-profile-pic.component.scss'
})
export class UpdateProfilePicComponent implements OnInit {

    @ViewChild(MatTable, {static: true}) 
	  profile_pic_table!: MatTable<any>;
	  // public img_url = API_URL+"api/public/files/profile-pic/";
    public img_url = "";

	  public files: NgxFileDropEntry[] = [];
  	public files_arr:any;
  	public displayedColumns: string[] = ['name','action'];
  	public uid = "";
    public current_profile_pic = "";

    constructor(
      @Inject(MAT_DIALOG_DATA) public data:any,
      public dialogRef: MatDialogRef<UpdateProfilePicComponent>,
      public authService: AuthenticateService,
      public toastrService: ToastrService
      ) 
    { }

    ngOnInit(): void {
      this.files_arr = [];
      this.uid = this.data.uid;
      this.current_profile_pic = this.data.profile_pic;

      this.img_url = API_URL+"public/files/profile-pic/"+this.current_profile_pic;
    }

    dropped(files: NgxFileDropEntry[]): void {
      this.files = files;
      if (this.files.length > 1) {
          
          this.toastrService.warning('Only Single Image is Allowed', '', {
            progressBar: true,
            timeOut: 2000
          });

        } else {

          for (const droppedFile of files) {

            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
              const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
              fileEntry.file((file: File) => {

                // Here you can access the real file
                // console.log(droppedFile.relativePath, fileEntry);
                // Object.assign(file, { cover_file: false });

                this.files_arr.push(file);
                this.profile_pic_table.renderRows(); // update material table
        
                // this.files_arr.push({
                //   lastModified: file.lastModified,  
                //   name: file.name, 
                //   size: file.size, 
                //   type: file.type, 
                //   webkitRelativePath: file.webkitRelativePath 
                // });

                // Here you can access the real file
                // for (let i = 0; i < this.files.length; i++) { 
                //   console.log(this.files.length);
                // }
                // console.log(droppedFile.relativePath, file);


                // const formData = new FormData()
                // formData.append('file', file, droppedFile.relativePath);
                // // console.log(formData.get('file'));
                // this.receiverService.insertComm(formData).subscribe((res: any) => {
                //   console.log(res);
                // },
                // (err: any) => {
                //   console.log("Error: "+err);
                // });

                /**
                // You could upload it like this:
                const formData = new FormData()
                formData.append('logo', file, relativePath)

                // Headers
                const headers = new HttpHeaders({
                  'security-token': 'mytoken'
                })

                this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
                .subscribe(data => {
                  // Sanitized logo returned from backend
                })
                **/

              });
            } else {
              // It was a directory (empty directories are added, otherwise only files)
              const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
              console.log(droppedFile.relativePath, fileEntry);
            }
        }
        
        }
      
    }


    removeFile(i:number): void { 
      // splice from  NgxFileDropEntry
      // for (let i = 0; i < this.files.length; i++) {
      //   this.files.splice(i);
      // }
      // console.log(i);
      // splice files on NGXFileEntry
      // this.files.splice(i, 1);

      // splice files_arr(array)(2 entries fileentry and relative path)
      // if (i === 0) {
      //   this.files_arr.splice(i, 2);
      // } else {
      //   i = i+1;
      //   this.files_arr.splice(i, 2);
      // }

      this.files_arr.splice(i, 1);
      this.profile_pic_table.renderRows();

    }

    closeDialog(): void {
      this.dialogRef.close('dialog closed!');
    }

    public fileOver(event: any){
      console.log(event);
    }

    public fileLeave(event: any){
      console.log(event);
    }

    updateProfilePic(): void {
  		const formData = new FormData();
  		formData.append('uid', this.uid);
        for (let i = 0; i < this.files_arr.length; i++) {
          formData.append('file[]', this.files_arr[i]);
        }

        this.authService.updateProfilePicture(formData).subscribe({
          next: (res) => {
            if (res[0].status == 'file_too_large') {
              this.toastrService.warning('File Must not exceed 1MB!', '', {
                    progressBar: true,
                    timeOut: 2000
                });
            } else if (res[0].status == 'format_not_supported') {
              this.toastrService.warning('Invalid File Format!', '', {
                    progressBar: true,
                    timeOut: 2000
                });
            } else if (res[0].status == 'fail') {
              this.toastrService.error('Profile Picture Update Failed!', '', {
                    progressBar: true,
                    timeOut: 2000
                });
            } else if (res[0].status == 'success') {
              this.toastrService.success('Profile Picture Successfully Updated!', '', {
                    progressBar: true,
                    timeOut: 2000
                });
  
                // Close Modal
                this.dialogRef.close({ response: 'success',profile_pic: res[0].profile_pic });
            } else {
              this.toastrService.error('Invalid Transaction!', '', {
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
        })
  	}
}
