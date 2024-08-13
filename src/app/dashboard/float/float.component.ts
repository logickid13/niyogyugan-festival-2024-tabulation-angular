import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-float',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbar,
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
  ],
  templateUrl: './float.component.html',
  styleUrl: './float.component.scss'
})
export class FloatComponent implements OnInit, OnDestroy {
  current_permission_observable!: Subscription;
  current_permission: number[] = [];

  constructor(
    private authService: AuthenticateService,
  ) {}

  ngOnDestroy(): void {
    if(this.current_permission_observable){
      this.current_permission_observable.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.current_permission_observable = this.authService.accountPermissionOb().subscribe(val => {
        this.current_permission = val;
      });
  }

}
