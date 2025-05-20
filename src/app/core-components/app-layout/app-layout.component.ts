import { Component, OnInit } from '@angular/core';
import { AppNavigationComponent } from '../../core-components/app-navigation/app-navigation.component'
import { RouterModule } from '@angular/router';
import { getOffsetHeightForCard } from '../../shared/functions/calcHeightOffset';
import { LoaderComponent } from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css'],
  imports: [RouterModule, AppNavigationComponent, LoaderComponent],
})
export class AppLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getOffsetHeightForCard(extra: any = 0) {
    return getOffsetHeightForCard(extra);
}

}
