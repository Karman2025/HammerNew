import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { paginationRowsPerPageOptions } from '../../data/master-data';

@Component({
  selector: 'app-table-paginator',
  templateUrl: './table-paginator.component.html',
  styleUrls: ['./table-paginator.component.css'],
  imports: [PaginatorModule]
})
export class TablePaginatorComponent implements OnInit {
  @Output() OnPageChange = new EventEmitter<any>();
  @Input() first:any;
  @Input() rows:any;
  @Input() totalRecords:any;
  // @Input() showFirstLastIcon = false;
  // @Input() showCurrentPageReport = false;
  // @Input() showPageLinks = false;
  paginationRowsPerPage = paginationRowsPerPageOptions;

  constructor() { }

  ngOnInit() {
  }

  onPageChange(event:any){
    this.OnPageChange.emit(event);
  }

}
