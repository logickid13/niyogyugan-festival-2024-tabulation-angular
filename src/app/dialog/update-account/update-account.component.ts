import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxFileDropModule, NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { UpdateBasicInfo, UpdatePassword, UnlockAccount, UserPermission } from '../../models/account.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription, throwError } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { AuthenticateService } from '../../services/authenticate.service';
import { environment } from '../../../environments/environment.development';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-update-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatExpansionModule,
    NgxFileDropModule
  ],
  templateUrl: './update-account.component.html',
  styleUrl: './update-account.component.scss'
})
export class UpdateAccountComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable, {static: true}) 
  profile_pic_table!: MatTable<any>;
  public img_url = API_URL+"files/profile-pic/";
  public files: NgxFileDropEntry[] = [];
  public files_arr:any;

  public id_no = "";
  public username = "";
  public fullname = "";
  public profile_pic = "";
  public permission = "";
  public active = "";
  public permission_arr: UserPermission[] = [];
  current_permission: number[] = [];
  main_permission: number[] = [];
  current_permission_observable!: Subscription;
  public displayedColumns: string[] = ['name','action'];

  public updateBasicInfoForm!: FormGroup;
  public updateBasicInfoData! :UpdateBasicInfo; // to be sent to server
  public updatePasswordForm!: FormGroup;
  public updatePasswordData! :UpdatePassword; // to be sent to server
  public resetLoginAttemptForm!: FormGroup;
  public resetLoginAttemptData!: UnlockAccount;

  constructor(
		@Inject(MAT_DIALOG_DATA) 
		public data:any,
		public dialogRef: MatDialogRef<UpdateAccountComponent>,
		public accountService: AccountService,
		public toastrService: ToastrService,
		public formBuilder: FormBuilder,
    private authService: AuthenticateService
		) 
	{ }

  get getBasicInfoControl(): any  {
    return this.updateBasicInfoForm.controls;
  }

  get getPasswordControl(): any  {
    return this.updatePasswordForm.controls;
  }

  get getControlArray(): any {
    return this.updateBasicInfoForm.get('permission_arr') as FormArray;
  }

  onCheckboxChangePermissionArr(e: any, item: any) {
    const checkArray: FormArray = this.updateBasicInfoForm.get('permission_arr') as FormArray;
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

      // console.log(checkArray.value);

    }
  }


  onCheckboxChangeSubPermissionArr(e: any) {
    const checkArray: FormArray = this.updateBasicInfoForm.get('permission_arr') as FormArray;
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

    this.files_arr.splice(i, 1);
    this.profile_pic_table.renderRows();

  }

  public fileOver(event: any){
    console.log(event);
  }

  public fileLeave(event: any){
    console.log(event);
  }

  ngOnInit(): void {

    this.id_no = this.data.id_no;
    this.username = this.data.username;
    this.fullname = this.data.fullname;

    if (this.data.profile_pic == "no_picture") {
      this.profile_pic = "no_picture.png";
    } else {
      this.profile_pic = this.data.profile_pic;
    }

    this.current_permission = this.data.permission;

    this.current_permission_observable = this.authService.accountPermissionOb().subscribe(val => {
      this.main_permission = val;
    });

    if (this.data.active === Number(0)) {
      this.active = String("0");
    } else {
      this.active = String("1");
    }

    this.files_arr = [];

    this.updateBasicInfoForm = this.formBuilder.group({
      id_no: [this.id_no],
      username: [this.username, [Validators.required, Validators.pattern("^[0-9]*$")]],
      fullname: [this.fullname, Validators.required],
      permission_arr: this.formBuilder.array([], [Validators.required]),
      active: [this.active, Validators.required]
    });

    this.updatePasswordForm = this.formBuilder.group({
        id_no: [this.id_no],
        username: [this.username],
        password: [null, Validators.required],
        confirm_password: [null, Validators.required]
    });

    this.resetLoginAttemptForm = this.formBuilder.group({
      username: [this.username]
    });

    this.accountService.loadPermission().subscribe({
      next: (res: any) => {
        this.permission_arr = res.permission;
        this.current_permission.forEach((el: any) => {
          // push to reactive form array
          this.getControlArray.push(new FormControl(Number(el))) 
        }); 

        // map permission array then set isSelected to true if exist
        this.permission_arr.map((item) => {
          // console.log(item);
            item.isSelected = false;
            this.current_permission.forEach((el: any) => {
              if (item.id == el) {
                  item.isSelected = true;
              }
            });

            item.sub_permission.forEach((sub_el) => {
              this.current_permission.forEach((el: any) => {
                if (sub_el.id == el) {
                  sub_el.isSelected = true;
                }
              });
            });
        });
      },
      error: (err) => {
        return throwError(() => err);
      }
    });
  }

  updateBasicInfo(): void {
    this.updateBasicInfoData = this.updateBasicInfoForm.value;
    this.updateBasicInfoForm.value.permission_arr = JSON.stringify(this.updateBasicInfoForm.value.permission_arr);
    // console.log(this.updateBasicInfoData);
    this.accountService.updateBasicInfo(this.updateBasicInfoData).subscribe({
      next: (res) => {
        if (res[0].status === 'fail') {
          this.toastrService.error('Basic Info Update Failed!', '', {
            progressBar: true,
            timeOut: 2000
          });
        } else if (res[0].status === 'success') {
          this.toastrService.success('Basic Info Updated!', '', {
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
    })
  }

  updateProfilePic(): void {
    const formData = new FormData();
    formData.append('uid', this.username);
      for (let i = 0; i < this.files_arr.length; i++) {
        formData.append('file[]', this.files_arr[i]);
      }

      this.accountService.updateProfilePicture(formData).subscribe({
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
      });
  }

  updatePassword(): void {
    if (this.updatePasswordForm.value.password !== this.updatePasswordForm.value.confirm_password) {
        this.toastrService.warning('Password Not Matched', '', {
          progressBar: true,
          timeOut: 2000
        });
    } else {
        this.updatePasswordData = this.updatePasswordForm.value;
        // console.log(this.updatePasswordData);
        this.accountService.updatePassword(this.updatePasswordData).subscribe({
          next: (res) => {
            if (res[0].status === 'fail') {
              this.toastrService.error('Password Update Failed!', '', {
                progressBar: true,
                timeOut: 2000
              });
            } else if (res[0].status === 'success') {
              this.toastrService.success('Password Updated!', '', {
                progressBar: true,
                timeOut: 2000
              });
              // Close Dialog
              this.dialogRef.close({ response:'updated' });
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

  resetLoginAttempts(): void {
    let accountUsername = this.username;

    if (confirm('Do you want to reset the login attempts of this account?')) {
      this.accountService.unlockAccount(accountUsername).subscribe({
        next: (res) => {
          if (res[0].status == "fail") {
            this.toastrService.warning('Account Unlock Failed!', '', {
              progressBar: true,
              timeOut: 2000
            });
          } else if (res[0].status == "success") {
            this.toastrService.success('Account Unlocked!', '', {
              progressBar: true,
              timeOut: 2000
            });
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

  closeDialog(): void {
    if (this.current_permission_observable) {
      this.current_permission_observable.unsubscribe();
    }
    this.dialogRef.close('dialog closed!');
  }

  ngOnDestroy(): void {
    if (this.current_permission_observable) {
      this.current_permission_observable.unsubscribe();
    }  
  }


}
