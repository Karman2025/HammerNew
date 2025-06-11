import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentsApiService } from '../../app-components-api-service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TrainerAddEditFormComponent } from "../trainer-add-edit-form/trainer-add-edit-form.component";
import { catchError, of } from 'rxjs';
import { getOffsetHeightForModal, getOffsetHeightForPrimaryTable } from '../../../shared/functions/calcHeightOffset';
import { MessageService } from 'primeng/api';
import { getOffsetHeightByCustomClass } from '../../../shared/functions/calcHeightOffset';
import { FilterFieldsContainerComponent } from '../../../shared/components/filter-fields-container/filter-fields-container.component';
import { PaginatorModule } from 'primeng/paginator';
import { paginationRowsPerPageOptions } from '../../../shared/data/master-data';
import { TooltipModule } from 'primeng/tooltip';
import { getPopupWidth } from '../../../shared/functions/responsiveFunction';
import { TablePaginatorComponent } from '../../../shared/components/table-paginator/table-paginator.component';


@Component({
  selector: 'app-trainers',
  imports: [CommonModule, TableModule, DialogModule, TrainerAddEditFormComponent, FilterFieldsContainerComponent, PaginatorModule, TooltipModule, TablePaginatorComponent],
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.css',
})
export class TrainersComponent {

  @ViewChild(TrainerAddEditFormComponent, { static: false })
    trainerAddEditComponent!: TrainerAddEditFormComponent;

  trainersList:any[] = [];
  formMode: "view" | "edit" | "create" = "view";
  isVisibleTrainerAddEditDialog:boolean = false;
  isVisibleTrainerFilterDialog: boolean = false;
  toastErrorMessage: string = 'Something went wrong';
  selectedTrainer: any;
  getBranchOptions: {_id: string, bch_Name: string, bch_Code: string}[] = [];
  containerOffSetHeightClasses:any[] = ['ofH_calc_nav_bar', 'ofH_calc_body_header'];
  paginationRowsPerPage = paginationRowsPerPageOptions;
  isButtonLoading: boolean = false;
  popupWidth = getPopupWidth();


  filterFields = {
    branchId: null,
    // bch_Code: null,
    tnr_Name: null,
    tnr_Code: null,
    tnr_MobileNo: null,
    tnr_Email: null,
  };
  showFilterFields = {
    branchId: true,
    // bch_Code: true,
    tnr_Name: true,
    tnr_Code: true,
    tnr_MobileNo: true,
    tnr_Email: true,
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

  constructor(private service:AppComponentsApiService, private toasterMessage: MessageService) {
    this.getAllTrainers();
    this.getAllBranchOptions();
    this.loggedInUser = JSON.parse(localStorage.getItem('USER-INFO') ?? "{}");
    if(this.loggedInUser?.role == "2") this.showFilterFields.branchId = false;
  }

  setFormMode(mode: "view" | "edit" | "create"): void {
    this.formMode = mode;
  }

  addTrainer() {
    this.setFormMode('create');
    this.selectedTrainer = {};
    this.isVisibleTrainerAddEditDialog = true;
  }
  viewTrainer(trainer: any) {
    this.setFormMode('view');
    this.selectedTrainer = JSON.parse(JSON.stringify(trainer));
    this.isVisibleTrainerAddEditDialog = true;
  }

  editTrainer(trainer: any) {
    this.setFormMode('edit');
    this.selectedTrainer = JSON.parse(JSON.stringify(trainer));
    this.isVisibleTrainerAddEditDialog = true;
  }

  getAllBranchOptions() {
    this.service.getAllBranchAutocompleteData().pipe(
      catchError((error) => {
        console.error('Error fetching branch options:', error);
        return of([]);
      })
    ).subscribe((res: any) => {
      if (res && Array.isArray(res)) {
        console.log('getAllBranchAutocomplete', res);
        this.getBranchOptions = res;
      } else {
        console.warn('Unexpected response format:', res);
        this.getBranchOptions = [];
      }
    });
  }

  getAllTrainers(resetPage: boolean = false){
    if (resetPage) this.pageNo = 1;
    let param:any = {
      pageSize : this.pageSize,
      pageNo : this.pageNo
    };
    param = {...param, ...this.filterFields}

    this.service.getAllTrainer(param).subscribe((res:any)=>{
      console.log(res)
      if(res?.Results) {
        this.trainersList = JSON.parse(JSON.stringify(res?.Results));
        this.xPagination = res?.XPagination;

        this.indexOfFirstRecord = (this.xPagination.currentPage - 1) * this.xPagination.pageSize;
        this.totalRecords = this.xPagination.totalCount;
      } else {
        console.warn('Unexpected response format:',res);
        this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: this.toastErrorMessage });
      }
    })
  }

  dialogCloseBtn() {
    this.isVisibleTrainerAddEditDialog = false;
  }
  onTrainerSubmit() {
    let formData:any = JSON.parse(JSON.stringify(this.selectedTrainer));
    let isCreateTrainerFormValid:any = this.trainerAddEditComponent.isCreateTrainerFormValid();
    if(isCreateTrainerFormValid){
      this.isButtonLoading = true;
      if (this.formMode === 'create'){
        this.service.createTrainer(formData).subscribe((res:any) => {
          console.log(res);
          // this.getAllTrainers();
          if (res?.Results && res?.Results?.error) {
            const errorMessage = res?.Results?.error;
            this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: errorMessage });
          } else {
            this.isVisibleTrainerAddEditDialog = false;
            this.getAllTrainers();
            this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: 'Trainer created successfully!' });
          };
          this.isButtonLoading = false;
        })
      } else if (this.formMode === 'edit') {
        this.service.updateTrainer(formData).subscribe((res: any)=> {
          console.log(res);
            // this.getAllTrainers();
            // this.isVisibleTrainerAddEditDialog = false;
            if (res?.Results && res?.Results?.error) {
              const errorMessage = res?.Results?.error;
              this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: errorMessage });
            } else {
              this.isVisibleTrainerAddEditDialog = false;
              this.getAllTrainers();
              this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: 'Trainer updated successfully!' });
            };
            this.isButtonLoading = false;
        })
      }
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
    this.getAllTrainers();
  }

  onFilterClear() {
    this.filterFields = {
      branchId: null,
      // bch_Code: null,
      tnr_Name: null,
      tnr_Code: null,
      tnr_MobileNo: null,
      tnr_Email: null,
    };
    this.getAllTrainers();
  }
}
