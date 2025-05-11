import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './app-navigation.component.html',
  styleUrls: ['./app-navigation.component.css'],
  imports: [RouterModule]
})
export class AppNavigationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  signOut() {
    localStorage.removeItem('USER-JWT-TOKEN')
  }

}
