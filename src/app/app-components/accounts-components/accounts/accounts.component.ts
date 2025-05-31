import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { getOffsetHeightForModal, getOffsetHeightForPrimaryTable } from '../../../shared/functions/calcHeightOffset';
import { AppComponentsApiService } from '../../app-components-api-service';
import { AccountsAddEditFormComponent } from '../accounts-add-edit-form/accounts-add-edit-form.component';
import { Popover } from 'primeng/popover';
import { getOffsetHeightByCustomClass } from '../../../shared/functions/calcHeightOffset';
import { FilterFieldsContainerComponent } from '../../../shared/components/filter-fields-container/filter-fields-container.component';
import { PaginatorModule } from 'primeng/paginator';
import { dateObjToString } from '../../../shared/functions/date-string-to-obj';
import { MessageService } from 'primeng/api';
import { paginationRowsPerPageOptions } from '../../../shared/data/master-data';
import { getPopupWidth } from '../../../shared/functions/responsiveFunction';


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
  imports: [CommonModule, TableModule, DialogModule, AccountsAddEditFormComponent, Popover, FilterFieldsContainerComponent, PaginatorModule]
})
export class AccountsComponent implements OnInit {

  @ViewChild('AccountsAddEditFormComponent', {static: false})
    accountsAddEditFormComponent!: AccountsAddEditFormComponent;

  accountsList:any[] = [];
  formMode: "view" | "edit" | "create" = "view";
  isVisibleAccountsAddEditDialog:boolean = false;
  toastErrorMessage: string = 'Something went wrong';
  selectedAccounts: any;
  containerOffSetHeightClasses:any[] = ['ofH_calc_nav_bar', 'ofH_calc_body_header'];
  paginationRowsPerPage = paginationRowsPerPageOptions;
  isButtonLoading: boolean = false;
  popupWidth = getPopupWidth();

  filterFields = {
    actionDate: null,
    paymentTypeId: null,
    isCredit: null,
    remarks: null,
    amount: null,
    actionDateFrom: '' as string | null,
    actionDateTo: '' as string | null,
  };
  showFilterFields = {
    actionDate: true,
    paymentTypeId: true,
    isCredit: true,
    remarks: true,
    amount: true,
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
    this.getAllAccounts();
  }

  ngOnInit() {
  }

  getAllAccounts(resetPage: boolean = false) {
    if (resetPage) this.pageNo = 1;
    let params:any = {
      pageSize : this.pageSize,
      pageNo : this.pageNo
    };
    this.filterFields.actionDateFrom = this.filterFields?.actionDate?.[0] ? dateObjToString(this.filterFields?.actionDate[0]) : null;
    this.filterFields.actionDateTo = this.filterFields?.actionDate?.[1] ? dateObjToString(this.filterFields?.actionDate[1]) : null;

    params = { ...params, ...this.filterFields };

    this.service.getAllAccounts(params).subscribe((res:any)=>{
      console.log(res);
      if(res?.Results) {
        this.accountsList = JSON.parse(JSON.stringify(res?.Results ?? []));
        this.xPagination = res?.XPagination;
  
        this.indexOfFirstRecord = (this.xPagination.currentPage - 1) * this.xPagination.pageSize;
        this.totalRecords = this.xPagination.totalCount;
      } else {
        this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: this.toastErrorMessage });
      }  
    })
  }

  openAddAccountsDialog(){
    this.selectedAccounts = {};
    this.isVisibleAccountsAddEditDialog = true;
  }

  onAccountsSubmit(){
    this.accountsAddEditFormComponent.isCreateAccountsFormValid

    let formData:any = JSON.parse(JSON.stringify(this.selectedAccounts));
    let isCreateCustomerFormValid:any = this.accountsAddEditFormComponent.isCreateAccountsFormValid();
    if(isCreateCustomerFormValid){
      this.isButtonLoading = true;
      this.service.createAccountEntry(formData).subscribe((res:any)=>{
        console.log(res);   
        if(res?.Results?._id){
          this.isVisibleAccountsAddEditDialog = false;
          this.getAllAccounts();
          const successMessage = 'Account entry created successfully';
          this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: successMessage });
        } else {
          this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: this.toastErrorMessage });
        };
        this.isButtonLoading = false;
      })
    }
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
      this.getAllAccounts();
    }


    onFilterClear() {
      this.filterFields = {
        actionDate: null,
        paymentTypeId: null,
        isCredit: null,
        remarks: null,
        amount: null,
        actionDateFrom: null,
        actionDateTo: null,
      };
      this.getAllAccounts();
    }
}
