import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentsApiService } from '../../app-components-api-service';
import { BranchAddEditFormComponent } from '../branch-add-edit-form/branch-add-edit-form.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { getOffsetHeightForModal, getOffsetHeightForPrimaryTable } from '../../../shared/functions/calcHeightOffset';
import { Popover } from 'primeng/popover';
import { getOffsetHeightByCustomClass } from '../../../shared/functions/calcHeightOffset';
import { FilterFieldsContainerComponent } from '../../../shared/components/filter-fields-container/filter-fields-container.component';
import { PaginatorModule } from 'primeng/paginator';
import { paginationRowsPerPageOptions } from '../../../shared/data/master-data';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css'],
  imports: [CommonModule, BranchAddEditFormComponent, TableModule, DialogModule, Popover, FilterFieldsContainerComponent, PaginatorModule, TooltipModule],
})
export class BranchesComponent implements OnInit {

  @ViewChild(BranchAddEditFormComponent, { static: false })
  branchAddEditComponent!: BranchAddEditFormComponent;

  branchesList:any[] = [];
  selectedBranch: any;
  selectedBranchClone: any;
  formMode: "view" | "edit" | "create" = "view";
  toastErrorMessage: string = 'Something went wrong';
  isVisibleBranchAddEditDialog:boolean = false;
  containerOffSetHeightClasses:any[] = ['ofH_calc_nav_bar', 'ofH_calc_body_header'];
  paginationRowsPerPage = paginationRowsPerPageOptions;
  isButtonLoading: boolean = false;

  filterFields = {
    bch_Code: null,
    bch_Location: null,
    bch_Name: null
  };
  showFilterFields = {
    bch_Code: true,
    bch_Location: true,
    bch_Name: true
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


  constructor(private service:AppComponentsApiService, private toasterMessage: MessageService) {
    this.getAllBranches();
  }

  ngOnInit() {
  }

  setFormMode(mode: "view" | "edit" | "create"): void {
    this.formMode = mode;

  }

  @HostListener('window:resize')
  onResize() {
    console.log('Window resized, triggering change detection');
  }


  onSelectViewBranch(branch: any) {
    this.setFormMode('view');
    this.selectedBranch = JSON.parse(JSON.stringify(branch));

    setTimeout(() => {
      this.isVisibleBranchAddEditDialog = true;
    })
  }

  onSelectEditBranch(branch: any) {
    this.setFormMode('edit');
    this.selectedBranch = JSON.parse(JSON.stringify(branch));
    // this.selectedBranchClone = JSON.parse(JSON.stringify(branch));
    this.isVisibleBranchAddEditDialog = true;
  }
  addBranchButton() {
    this.setFormMode('create');
    this.selectedBranch = {};
    this.isVisibleBranchAddEditDialog = true;
  }


  getAllBranches(resetPage: boolean = false){
    if (resetPage) this.pageNo = 1;
    
    let params:any = {
      pageSize : this.pageSize,
      pageNo : this.pageNo
    };
    params = {...params, ...this.filterFields}
    this.service.getAllBranch(params).subscribe((res:any)=>{
      console.log(res);
      if(res?.Results) {
        this.branchesList = JSON.parse(JSON.stringify(res?.Results ?? []));
        this.xPagination = res?.XPagination;
        this.indexOfFirstRecord = (this.xPagination.currentPage - 1) * this.xPagination.pageSize;
        console.log(this.indexOfFirstRecord)
        this.totalRecords = this.xPagination.totalCount;
      } else {
        this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: this.toastErrorMessage });
      }
      
    })
  }

  onBranchDetailsSave(){
   // this.branchAddEditComponent.onSubmitBranch();

   let formData:any = JSON.parse(JSON.stringify(this.selectedBranch));
  //  let formData1 = {...formData,  role: '1'};

   let isCreateBranchFormValid:any = this.branchAddEditComponent.isCreateBranchFormValid();
   if(isCreateBranchFormValid) {
     this.isButtonLoading = true;
     if (this.formMode === 'create'){
       this.service.createBranch(formData).subscribe((res:any) => {
        console.log(res);
        
        if (res?.Results && res?.Results?.error) {
          const errorMessage = res?.Results?.error;
          this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: errorMessage });
        } else if (res?.Results && !res?.Results?.error) {
         this.isVisibleBranchAddEditDialog = false;
         this.getAllBranches();
         this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: 'Branch created successfully!' });
        };
        this.isButtonLoading = false;
      })
     } else if (this.formMode === 'edit') {
       this.service.updateBranch(formData).subscribe((res:any) => {
        console.log(res);
        
        if (res?.Results && res?.Results?.error) {
          const errorMessage = res?.Results?.error;
          this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: errorMessage });
        } else if (res?.Results && res?.Results?.message === 'Branch updated successfully') {
           this.isVisibleBranchAddEditDialog = false;
           this.getAllBranches();
           this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: 'Branch updated successfully!' });
        } else {
          this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: this.toastErrorMessage });
        };

        this.isButtonLoading = false;
      })
     }
   }
  }

  dialogCloseBtn() {
   this.isVisibleBranchAddEditDialog = false;
   this.branchAddEditComponent.onFormClear();
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


    // Now call API with requestedPage and rows
    this.pageNo = requestedPage;
    this.pageSize = rows;
    this.getAllBranches();
  }

  onFilterClear(){
    this.filterFields = {
      bch_Code: null,
      bch_Location: null,
      bch_Name: null
    };
    this.getAllBranches();
  }

  get dialogWidth(): string {
    console.log(window.innerWidth);
    
  if (window.innerWidth < 576) return '95vw';       // extra small screens
  if (window.innerWidth < 768) return '80vw';       // small devices
  if (window.innerWidth < 992) return '60vw';       // tablets
  return '30vw';                                     // desktop default
}


}
