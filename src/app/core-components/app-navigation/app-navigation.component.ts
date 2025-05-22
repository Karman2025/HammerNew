import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-navigation',
  templateUrl: './app-navigation.component.html',
  styleUrls: ['./app-navigation.component.css'],
  imports: [RouterModule, Popover, CommonModule],
})
export class AppNavigationComponent implements OnInit {
  menuOpen = false;
  loggedInUser: any;
  constructor() {
    this.loggedInUser = JSON.parse(localStorage.getItem('USER-INFO') ?? '{}');
  }

  ngOnInit() {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  signOut() {
    localStorage.removeItem('USER-JWT-TOKEN');
  }
}
