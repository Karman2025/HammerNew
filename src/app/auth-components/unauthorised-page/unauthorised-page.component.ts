import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorised-page',
  templateUrl: './unauthorised-page.component.html',
  styleUrls: ['./unauthorised-page.component.css']
})
export class UnauthorisedPageComponent implements OnInit {

  constructor(
  private router: Router,
  ) { }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/home/welcome']);
  }

}
