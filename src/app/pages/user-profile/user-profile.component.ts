import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { AdminService } from 'src/app/services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { TokenstorageService } from 'src/app/services/tokenstorage/tokenstorage.service';

import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, AfterViewInit {

  formGroup = new FormGroup({
    oldpwd: new FormControl("", [Validators.required, Validators.minLength(8)]),
    newpwd: new FormControl("", [Validators.required, Validators.minLength(8)]),
  });

  hidePwd = true;
  isFormValid = true;

  currentUser: User;

  constructor(
    private adminService: AdminService,
    private tokenStorage: TokenstorageService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.getCurrentUser()
  }

  ngAfterViewInit() {
    this.onFormValuesChanged();
  }

  private getCurrentUser() {
    this.adminService.getAll().subscribe({
      next: (adminList) => {
        const userEmail = this.tokenStorage.getUser().email;
        this.currentUser = adminList.find(x => x.email = userEmail);
      }
    });
  }

  private onFormValuesChanged() {
    this.formGroup.valueChanges.subscribe( () => {
      if (this.formGroup.get('oldpwd').valid && this.formGroup.get('newpwd').valid) {
        this.isFormValid = true;
      } else {
        this.isFormValid = false;
      }
    });
  }

  savePassword() {
    const userId = this.currentUser?.id;
    const oldPwd = this.formGroup.get('oldpwd').value;
    const newPwd = this.formGroup.get('newpwd').value;
    // todo call the service
  }
}
