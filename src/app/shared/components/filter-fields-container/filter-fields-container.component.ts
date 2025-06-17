import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { paymentTypeMaster, creditDebitOptions, paymentStatusOptions, attendanceStatusOptions, paymentPlanOptions, paymentPlanStatus } from '../../../shared/data/master-data';

@Component({
  selector: 'app-filter-fields-container',
  templateUrl: './filter-fields-container.component.html',
  styleUrls: ['./filter-fields-container.component.css'],
  imports: [CommonModule, FormsModule, SelectModule, DatePickerModule]
})
export class FilterFieldsContainerComponent implements OnInit {

  @Input() branchOptions: { _id: string, bch_Name: string, bch_Code: string }[]=[];
  @Input() showFilterFields:any;
  @Input() set FilterFields(value:any) {
    // console.log(value)
    this.filterFields = value;
  };
  get FilterFields(): any {
    return this.filterFields;
  }

  createCustomerForm!  : FormGroup;
  filterFields:any = {};
  paymentOptions = paymentTypeMaster;
  paymentStatus = paymentStatusOptions;
  attendanceStatus = attendanceStatusOptions
  creditStatus  = creditDebitOptions;
  paymentPlanOptions = paymentPlanOptions;
  paymentPlanStatus = paymentPlanStatus;

  constructor() {
  }

  ngOnInit() {
  }

}
