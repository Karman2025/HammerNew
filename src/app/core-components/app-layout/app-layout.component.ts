import { Component, OnInit } from '@angular/core';
import { AppNavigationComponent } from '../../core-components/app-navigation/app-navigation.component'
import { RouterModule } from '@angular/router';
import { getOffsetHeightForCard } from '../../shared/functions/calcHeightOffset';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css'],
  imports: [RouterModule, AppNavigationComponent]
})
export class AppLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getOffsetHeightForCard(extra: any = 0) {
    return getOffsetHeightForCard(extra);
}

}
