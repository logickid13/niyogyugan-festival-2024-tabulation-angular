import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nested-container',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './nested-container.component.html',
  styleUrl: './nested-container.component.scss'
})
export class NestedContainerComponent implements OnInit {


  constructor() {}

  ngOnInit(): void {

  }
}
