import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxFileDropModule, NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { NewAccount, UserPermission } from '../../models/account.model';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-new-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    NgxFileDropModule
  ],
  templateUrl: './new-account.component.html',
  styleUrl: './new-account.component.scss'
})
export class NewAccountComponent implements OnInit {

  @ViewChild(MatTable, {static: true}) 
  profile_pic_table!: MatTable<any>;
  public files: NgxFileDropEntry[] = [];
  public files_arr:any;
  public permission_arr: UserPermission[] = [];
  public displayedColumns: string[] = ['name','action'];

  public newAccountForm!: FormGroup;
  public newAccountData! :NewAccount[]; // to be sent to server
  profile_pic_toggle: boolean = false;

  constructor(
		public dialogRef: MatDialogRef<NewAccountComponent>,
  	public accountService: AccountService,
		public toastrService: ToastrService,
		public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
      this.files_arr = [];

    	this.accountService.loadPermission().subscribe({
        next: (res: any) => {
          this.permission_arr = res.permission;
        },
        error: (err) => {
          return throwError(() => err);
        }
      });

      this.newAccountForm = this.formBuilder.group({
        username: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
        password: [null, [Validators.required]],
        confirm_password: [null, [Validators.required]],
        fullname: [null, [Validators.required]],
        permission_arr: this.formBuilder.array([], [Validators.required]),
        profile_pic: [null, [Validators.required]],
      });

      this.newAccountForm.markAllAsTouched();

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

  public fileOver(event: any){
    console.log(event);
  }

  public fileLeave(event: any){
    console.log(event);
  }

  onCheckboxChangePermissionArr(e: any, item: any) {
    const checkArray: FormArray = this.newAccountForm.get('permission_arr') as FormArray;
    if (e.checked) {
      checkArray.push(new FormControl(Number(e.source.value)));

      // get sub permission and set isSelected to true
      item.sub_permission.forEach((el: any) => {
        checkArray.push(new FormControl(Number(el.id)));
        return el.isSelected = true;
      });
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item_perm: any) => {
        if (item_perm.value == e.source.value) {

          // unselect all sub_permission
          item.sub_permission.map((el:any) => {

            if(checkArray.value.includes(el.id)) {
              checkArray.removeAt(i);
            }

            return el.isSelected = false;
          });

          checkArray.removeAt(i);
          return;
        }
        i++;
      });

    }
  }


  onCheckboxChangeSubPermissionArr(e: any) {
    const checkArray: FormArray = this.newAccountForm.get('permission_arr') as FormArray;
    if (e.checked) {
      checkArray.push(new FormControl(Number(e.source.value)));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item_perm: any) => {
        if (item_perm.value == e.source.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  get getControl(): any  {
    return this.newAccountForm.controls;
  }

  get getControlArray(): any {
    return this.newAccountForm.get('permission_arr') as FormArray;
  }

  onProfilePicDropdownChange(e: any) {
    // console.log(e.value);
    if (e.value == "y") {
      this.profile_pic_toggle = true;
    } else if (e.value == "n") {
      this.files_arr = [];
      this.profile_pic_table.renderRows();
      this.profile_pic_toggle = false;
    } else {
      this.files_arr = [];
      this.profile_pic_table.renderRows();
      this.profile_pic_toggle = false;
    }
  }

  onSubmit() {
    if (this.newAccountForm.value.password != this.newAccountForm.value.confirm_password) {
        this.toastrService.warning('Password Not Matched', '', {
          progressBar: true,
          timeOut: 2000
        });
    } else {
      if (this.newAccountForm.value.profile_pic == "n") {
        // send as json
        this.newAccountForm.value.permission_arr = JSON.stringify(this.newAccountForm.value.permission_arr);
        this.newAccountData = this.newAccountForm.value;
        // console.log(this.newAccountData);
        this.accountService.newAccountnoProfilePic(this.newAccountData).subscribe({
          next: (res) => {
            if (res[0].status == "fail") {
              this.toastrService.warning('Record Insert Failed!', '', {
                progressBar: true,
                timeOut: 2000
              });
            } else if (res[0].status == "username_exist") {
              this.toastrService.warning('Username already exist!', '', {
                progressBar: true,
                timeOut: 2000
              });
            } else if (res[0].status == "file_too_large") {
              this.toastrService.warning('File must not exceed 1MB!', '', {
                progressBar: true,
                timeOut: 2000
              });
            } else if (res[0].status == "format_not_supported") {
              this.toastrService.warning('Only (".jpg",".png",".tif",".gif") are allowed', 'Invalid File Format!', {
                progressBar: true,
                timeOut: 2000
              });
            } else if (res[0].status == "success") {
              this.toastrService.success('Record Added!', '', {
                progressBar: true,
                timeOut: 2000
              });
              // Close Dialog
              this.dialogRef.close({ response:'success' });
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
        });

      } else if (this.newAccountForm.value.profile_pic == "y") {
        // send as form data
        if (this.files_arr.length <= 0) {
          this.toastrService.warning('Please upload a file!', '', {
            progressBar: true,
            timeOut: 2000
          });
        } else {
          const formData = new FormData();
          formData.append('username', this.newAccountForm.value.username);
          formData.append('password', this.newAccountForm.value.password);
          formData.append('fullname', this.newAccountForm.value.username);
          formData.append('permission_arr', JSON.stringify(this.newAccountForm.value.permission_arr));
          for (let i = 0; i < this.files_arr.length; i++) {
            formData.append('file[]', this.files_arr[i]);
          }

          this.accountService.newAccountWithProfilePic(formData).subscribe({
            next: (res) => {
              if (res[0].status == "fail") {
                this.toastrService.warning('Record Insert Failed!', '', {
                  progressBar: true,
                  timeOut: 2000
                });
              } else if (res[0].status == "username_exist") {
                this.toastrService.warning('Username already exist!', '', {
                  progressBar: true,
                  timeOut: 2000
                });
              } else if (res[0].status == "file_too_large") {
                this.toastrService.warning('File must not exceed 1MB!', '', {
                  progressBar: true,
                  timeOut: 2000
                });
              } else if (res[0].status == "format_not_supported") {
                this.toastrService.warning('Only (".jpg",".png",".tif",".gif") are allowed', 'Invalid File Format!', {
                  progressBar: true,
                  timeOut: 2000
                });
              } else if (res[0].status == "success") {
                this.toastrService.success('Record Added!', '', {
                  progressBar: true,
                  timeOut: 2000
                });
                // Close Dialog
                this.dialogRef.close({ response:'success' });
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
          });

        }
      }
    }

  }

  closeDialog(): void {
    this.dialogRef.close('dialog closed!');
  }

}
