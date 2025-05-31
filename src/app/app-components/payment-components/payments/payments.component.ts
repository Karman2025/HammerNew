import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { getOffsetHeightForModal, getOffsetHeightForPrimaryTable } from '../../../shared/functions/calcHeightOffset';
import { PaymentPlanViewAddEditFormComponent } from '../payment-plan-view-add-edit-form/payment-plan-view-add-edit-form.component';
import { AppComponentsApiService } from '../../app-components-api-service';
import { CommonModule } from '@angular/common';
import { Popover } from 'primeng/popover';
import { getOffsetHeightByCustomClass } from '../../../shared/functions/calcHeightOffset';
import { FilterFieldsContainerComponent } from '../../../shared/components/filter-fields-container/filter-fields-container.component';
import { PaginatorModule } from 'primeng/paginator';
import { catchError, of } from 'rxjs';
import { dateObjToString } from '../../../shared/functions/date-string-to-obj';
import { paginationRowsPerPageOptions } from '../../../shared/data/master-data';
import { MessageService } from 'primeng/api';
import { getPopupWidth } from '../../../shared/functions/responsiveFunction';


interface Payments {
  customerCode: string;
  customerName: string;
  branchCode: string;
  branchName: string;
  paymentPlan: string;
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
  imports: [TableModule, PaymentPlanViewAddEditFormComponent, Popover, FilterFieldsContainerComponent, CommonModule, PaginatorModule] // Include TableModule here
})
export class PaymentsComponent implements OnInit {
  customersPaymentPlan: Payments[] = [];
  containerOffSetHeightClasses:any[] = ['ofH_calc_nav_bar', 'ofH_calc_body_header'];
  toastErrorMessage: string = 'Something went wrong';
  getBranchOptions: {_id: string, bch_Name: string, bch_Code: string}[] = [];
  paginationRowsPerPage = paginationRowsPerPageOptions;
  popupWidth = getPopupWidth();
  


  filterFields = {
    branchId: null,
    ctr_Name: null,
    ctr_Code: null,
    ctr_MobileNo: null,
    // ctr_WhatsAppNo: null,
    paymentStatus: null,
    paymentPlanId: null,
    planStartDate: null,
    planStartDateFrom: '' as string | null,
    planStartDateTo: '' as string | null,
    planEndDate: null,
    planEndDateFrom: '' as string | null,
    planEndDateTo: '' as string | null,
  };

  showFilterFields = {
    // branchId: true,
    // bch_Code: true,
    ctr_Name: true,
    ctr_Code: true,
    ctr_MobileNo: true,
    // ctr_WhatsAppNo: true,
    paymentStatus: true,
    paymentPlanId: true,
    planStartDate: true,
    planEndDate: true,
  };

  xPagination: any = {
    currentPage: 1,
    pageSize: 15,
    totalPages: 1,
    totalCount: 9,
    hasNextPage: false,
    hasPreviousPage: false
  };
  pageSize:number = 15;
  pageNo:number = 1;
  indexOfFirstRecord:number = 0;
  totalRecords:any;

  constructor(
    private service: AppComponentsApiService,
    private toasterMessage: MessageService
  ) {
    this.getAllCustomerPaymentPlans();
    this.getAllBranchAutocompleteData();
  }

  ngOnInit() {

  }

  getAllCustomerPaymentPlans(resetPage: boolean = false){
    if (resetPage) this.pageNo = 1;
    let params:any = {
      pageSize : this.pageSize,
      pageNo : this.pageNo
    };
    this.filterFields.planStartDateFrom = this.filterFields?.planStartDate?.[0] ? dateObjToString(this.filterFields?.planStartDate[0]) : null;
    this.filterFields.planStartDateTo = this.filterFields?.planStartDate?.[1] ? dateObjToString(this.filterFields?.planStartDate[1]) : null;
    this.filterFields.planEndDateFrom = this.filterFields?.planEndDate?.[0] ? dateObjToString(this.filterFields?.planEndDate[0]) : null;
    this.filterFields.planEndDateTo = this.filterFields?.planEndDate?.[1] ? dateObjToString(this.filterFields?.planEndDate[1]) : null;
    params = {...params, ...this.filterFields};
    this.service.getAllCustomerPaymentPlans(params).subscribe((res:any)=>{
      if(res?.Results) {
        this.customersPaymentPlan = [];
        this.customersPaymentPlan = JSON.parse(JSON.stringify(res?.Results ?? []));
        this.xPagination = res?.XPagination;
        this.indexOfFirstRecord = (this.xPagination.currentPage - 1) * this.xPagination.pageSize;
        this.totalRecords = this.xPagination.totalCount;
      } else {
        this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: this.toastErrorMessage });
      }
      
    })
  }

  getAllBranchAutocompleteData() {
      this.service.getAllBranchAutocompleteData().pipe(
        catchError((error) => {
          console.error('Error fetching branch options:', error);
          return of([]);
        })
      ).subscribe((res: any) => {
        if (res && Array.isArray(res)) {
          this.getBranchOptions = res;
        } else {
          console.warn('Unexpected response format:', res);
          this.getBranchOptions = [];
        }
      });
    }

  getOffsetHeightForModal(extra: any = 0) {
    return getOffsetHeightForModal(extra);
  }

  getOffsetHeightForPrimaryTable(extra: any = 0) {
    return getOffsetHeightForPrimaryTable(extra);
  }
  getOffsetHeightByCustomClass(extra: any = 0, customClasses:any[] = []){
    return getOffsetHeightByCustomClass(extra, customClasses);
  }

  onPageChange(event: any) {
    const page = event.page; // 0-based page index
    const rows = event.rows; // page size

    const requestedPage = page + 1; // because your backend uses 1-based index

    console.log('Go to page:', requestedPage);

    // Now call API with requestedPage and rows
    this.pageNo = requestedPage;
    this.pageSize = rows;
    this.getAllCustomerPaymentPlans();
  }

  onFilterClear() {
    this.filterFields = {
      branchId: null,
      ctr_Name: null,
      ctr_Code: null,
      ctr_MobileNo: null,
      // ctr_WhatsAppNo: null,
      paymentStatus: null,
      paymentPlanId: null,
      planStartDate: null,
      planEndDate: null,
      planStartDateFrom: null,
      planStartDateTo: null,
      planEndDateFrom: null,
      planEndDateTo: null
    };
    this.getAllCustomerPaymentPlans();
  }
}
