import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Popover } from 'primeng/popover';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-navigation',
  templateUrl: './app-navigation.component.html',
  styleUrls: ['./app-navigation.component.css'],
  imports: [RouterModule, Popover, CommonModule,DrawerModule, ButtonModule, AvatarModule],
})
export class AppNavigationComponent implements OnInit {
  loggedInUser:any;
  isMobileScreen: boolean = false;
  visible: boolean = false;

  constructor() {
    this.loggedInUser = JSON.parse(localStorage.getItem('USER-INFO') ?? "{}");
  }

  ngOnInit() {
    this.updateMobileStatus();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateMobileStatus();
  }

  updateMobileStatus() {
    this.isMobileScreen = window.innerWidth <= 1100;
  }

  @ViewChild('drawerRef') drawerRef!: Drawer;

    closeCallback(e: any): void {
        this.drawerRef.close(e);
    }

  signOut() {
    localStorage.removeItem('USER-JWT-TOKEN');
  }
}
