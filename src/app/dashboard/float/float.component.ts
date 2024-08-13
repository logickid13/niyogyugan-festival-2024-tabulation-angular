import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-float',
  standalone: true,
  imports: [
    MatToolbar,
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
  ],
  templateUrl: './float.component.html',
  styleUrl: './float.component.scss'
})
export class FloatComponent {

}
