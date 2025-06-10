import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AppComponentsApiService } from '../../app-components-api-service';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { CustomerAddEditFormComponent } from '../customer-add-edit-form/customer-add-edit-form.component';
import { getOffsetHeightForModal, getOffsetHeightForPrimaryTable } from '../../../shared/functions/calcHeightOffset';
import { dateObjToString } from '../../../shared/functions/date-string-to-obj';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Popover } from 'primeng/popover';
import { getOffsetHeightByCustomClass } from '../../../shared/functions/calcHeightOffset';
import { getPopupWidth } from '../../../shared/functions/responsiveFunction'
import { FilterFieldsContainerComponent } from '../../../shared/components/filter-fields-container/filter-fields-container.component';
import { PaginatorModule } from 'primeng/paginator';
import { paginationRowsPerPageOptions } from '../../../shared/data/master-data';
import { TooltipModule } from 'primeng/tooltip';
import { TablePaginatorComponent } from '../../../shared/components/table-paginator/table-paginator.component';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  imports: [CommonModule, TableModule, DialogModule, CustomerAddEditFormComponent,Popover, FilterFieldsContainerComponent,PaginatorModule, TooltipModule, TablePaginatorComponent],
})
export class CustomersComponent implements OnInit {

  @ViewChild(CustomerAddEditFormComponent, { static: false })
    customerAddEditFormComponent!: CustomerAddEditFormComponent;

  formMode: "view" | "edit" | "create" = "view";
  toastErrorMessage: string = 'Something went wrong';
  customersList: any[] = [];
  isVisibleCustomerddEditDialog:boolean = false;
  selectedCustomer: any;
  isSaving: boolean = false;
  getBranchOptions: {_id: string, bch_Name: string, bch_Code: string}[] = [];
  containerOffSetHeightClasses:any[] = ['ofH_calc_nav_bar', 'ofH_calc_body_header'];
  paginationRowsPerPage = paginationRowsPerPageOptions;
  isButtonLoading: boolean = false;
  popupWidth = getPopupWidth();

  filterFields = {
    branchId: null,
    // bch_Code: null,
    ctr_Name: null,
    ctr_Code: null,
    ctr_MobileNo: null,
    ctr_WhatsAppNo: null,
    ctr_Email: null,
    createdDate: null,
    createdDateFrom: '' as string | null,
    createdDateTo: '' as string | null,
    paymentPlanStatus: null
  };
  showFilterFields = {
    branchId: true,
    // bch_Code: true,
    ctr_Name: true,
    ctr_Code: true,
    ctr_MobileNo: true,
    ctr_WhatsAppNo: true,
    ctr_Email: true,
    createdDate: true,
    paymentPlanStatus: true
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
  loggedInUser:any;
  isVisibleDeleteCustomerConfirmationDialog:boolean = false;
  isVisibleFilterCustomerDetailsDialog:boolean = false;
  isDeletingCustomer:boolean = false;
  deleteCustomerDetails:any;
  constructor(
    private service:AppComponentsApiService,
    private router: Router,
    private toasterMessage: MessageService) {
    this.getAllCustomers();
    this.getAllBranchAutocompleteData();
    this.loggedInUser = JSON.parse(localStorage.getItem('USER-INFO') ?? "{}");
    if(this.loggedInUser?.role == "2") this.showFilterFields.branchId = false;

    if(this.loggedInUser?.role == "3"){
      this.showFilterFields = {
        branchId: false,
        ctr_Name: true,
        ctr_Code: true,
        ctr_MobileNo: true,
        ctr_WhatsAppNo: false,
        ctr_Email: false,
        createdDate: true,
        paymentPlanStatus: false
      };
    }
  }

  ngOnInit(): void {
  }

  setFormMode(mode: "view" | "edit" | "create"): void {
    this.formMode = mode;
  }

  addCustomer() {
    this.setFormMode('create');
    this.selectedCustomer = {};
    this.isVisibleCustomerddEditDialog = true;
  }
  viewCustomer(customer: any) {
    this.setFormMode('view');
    this.selectedCustomer = JSON.parse(JSON.stringify(customer));
    this.router.navigate(['/home/customers/customer-details'], {
      queryParams: { customerId: this.selectedCustomer?._id }
    });
  }

  openDeleteCustomerConfirmationDialog(customer:any){
    this.deleteCustomerDetails = JSON.parse(JSON.stringify(customer));
    this.isVisibleDeleteCustomerConfirmationDialog = true;
  }

  deleteCustomer(){
    console.log(this.deleteCustomerDetails)
    this.service.deleteCustomer(this.deleteCustomerDetails._id).subscribe((res:any)=>{
      console.log(res)
      if(res && res?.Results && res?.Results?.message == "Customer deleted successfully"){
        this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: 'Customer deleted successfully' });
        this.isVisibleDeleteCustomerConfirmationDialog = false;
        this.customersList = this.customersList?.filter((x:any) => x?._id != this.deleteCustomerDetails?._id);
      } else {
        this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: this.toastErrorMessage });
      }
    })
  }

  getAllCustomers(resetPage: boolean = false){
    if (resetPage) this.pageNo = 1;

    let params:any = {
      pageSize : this.pageSize,
      pageNo : this.pageNo
    };
    this.filterFields.createdDateFrom = this.filterFields?.createdDate?.[0] ? dateObjToString(this.filterFields?.createdDate[0]) : null;
    this.filterFields.createdDateTo = this.filterFields?.createdDate?.[1] ? dateObjToString(this.filterFields?.createdDate[1]) : null;
    params = {...params, ...this.filterFields}
    this.service.getAllCustomer(params).subscribe((res:any)=>{
      console.log(res);
      if(res?.Results?.length >= 0) {
        this.customersList = JSON.parse(JSON.stringify(res?.Results ?? []));
        this.xPagination = res?.XPagination;
        this.indexOfFirstRecord = (this.xPagination.currentPage - 1) * this.xPagination.pageSize;
        this.totalRecords = this.xPagination.totalCount;
      } else {
        console.warn('Unexpected response format:',res);
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
        this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: this.toastErrorMessage });
      }
    });
  }

  dialogCloseBtn() {
    this.isVisibleCustomerddEditDialog = false;
  }

onCustomerCreate() {
  let formData:any = JSON.parse(JSON.stringify(this.selectedCustomer));
  let isCreateCustomerFormValid:any = this.customerAddEditFormComponent.isCreateCustomerFormValid();

  if(isCreateCustomerFormValid) {
    this.isSaving = true; // Start loading
    formData.ctr_Dob = dateObjToString(formData?.ctr_Dob);

      this.service.createCustomer(formData).subscribe((res:any) => {
        console.log(res);
        if(res?.Results?._id){
          this.isVisibleCustomerddEditDialog = false;
          this.getAllCustomers();
          if(this.loggedInUser?.role != "3"){
            this.router.navigate(['/home/customers/customer-details'], {
              queryParams: { customerId: res?.Results?._id }
            });
          }
          this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: 'Customer created successfully!' });
        } else {
          this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: res?.Results?.error });
        }
        this.isSaving = false;
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
      this.getAllCustomers();
    }

    onFilterClear(){
      this.filterFields = {
        branchId: null,
        // bch_Code: null,
        ctr_Name: null,
        ctr_Code: null,
        ctr_MobileNo: null,
        ctr_WhatsAppNo: null,
        ctr_Email: null,
        createdDate: null,
        createdDateFrom: null,
        createdDateTo: null,
        paymentPlanStatus: null
      };
      this.getAllCustomers();
    }
}
