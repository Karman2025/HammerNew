import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideButtonComponent } from '../../../shared/components/slide-button/slide-button.component';
import { AppComponentsApiService } from '../../app-components-api-service';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms'
import { dateObjToString, newDateString } from '../../../shared/functions/date-string-to-obj';
import { Popover } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { getOffsetHeightByCustomClass } from '../../../shared/functions/calcHeightOffset';
import { TooltipModule } from 'primeng/tooltip';
import { FilterFieldsContainerComponent } from '../../../shared/components/filter-fields-container/filter-fields-container.component';
import { catchError, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { getPopupWidth } from '../../../shared/functions/responsiveFunction';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
   imports: [CommonModule, SlideButtonComponent, DatePicker, FormsModule, Popover, ButtonModule, TooltipModule, FilterFieldsContainerComponent, InfiniteScrollDirective]
})
export class AttendanceComponent implements OnInit {
  attendanceList: any[] = [];
  selectedCustomer: any;
  attendanceDate: any;
  maxDate: Date = new Date;
  formattedDate: string = '';
  toastErrorMessage: string = 'Something went wrong';
  isPastDay: boolean = false;
  containerOffSetHeightClasses:any[] = ['ofH_calc_nav_bar', 'ofH_calc_body_header'];
  getBranchOptions: {_id: string, bch_Name: string, bch_Code: string}[] = [];
  popupWidth = getPopupWidth();

  filterFields = {
    branchId: null,
    ctr_Name: null,
    ctr_Code: null,
    ctr_MobileNo: null,
    ctr_WhatsAppNo: null,
    isPresent: null
  };
  showFilterFields = {
    branchId: true,
    ctr_Name: true,
    ctr_Code: true,
    ctr_MobileNo: true,
    ctr_WhatsAppNo: true,
    isPresent: true
  };
  loggedInUser:any;
  pageSize:number = 15;
  pageNo:number = 1;
    xPagination: any = {
    currentPage: 1,
    pageSize: 15,
    totalPages: 1,
    totalCount: 9,
    hasNextPage: false,
    hasPreviousPage: false
  };

  constructor(
    private service: AppComponentsApiService,
    private toasterMessage: MessageService) {
    this.attendanceDate = new Date();
    this.getAllAttendance();
    this.getAllBranchAutocompleteData();
    this.loggedInUser = JSON.parse(localStorage.getItem('USER-INFO') ?? "{}");
    if(this.loggedInUser?.role == "2") this.showFilterFields.branchId = false;
  }

  ngOnInit() {
  }

  getAllBranchAutocompleteData() {
      this.service.getAllBranchAutocompleteData(false).pipe(
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


  attendanceDateSelect(event: any) {
    console.log("Selected date: ", event);
    this.attendanceDate = event; // stays as Date
    const formatted = dateObjToString(event)?.split('T')[0];
    console.log("Formatted: ", formatted);
    this.getAllAttendance();
  }


  onCheckin(item: any){
    console.log('onslide')
    console.log(item);
    this.selectedCustomer = JSON.parse(JSON.stringify(item));
    this.checkInCustomer();
  }

  getAllAttendance(resetPage: boolean = false, showLoader: boolean = true) {
    if (resetPage) this.pageNo = 1;
    const formattedDate = dateObjToString(this.attendanceDate)?.split('T')[0]!;
    const todaysDate  = newDateString();
    if (formattedDate < todaysDate) this.isPastDay = true; else this.isPastDay = false;

    let param:any = {
      pageSize : this.pageSize,
      pageNo : this.pageNo,
      attendanceDate: formattedDate,
    };

    param = {...param, ...this.filterFields}

    this.service.getAllAttendance(param, showLoader).subscribe((res: any) => {
      if(res?.Results) {
        this.attendanceList = [...this.attendanceList, ...res.Results];
        console.log(this.attendanceList);
        this.xPagination = res?.XPagination;
      } else {
        console.warn('Unexpected response format:',res);
        this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: this.toastErrorMessage });
      }
    });
  }


  checkInCustomer() {
    const todaysDate  = newDateString();
    const selectedDate = this.attendanceDate?.toISOString().split('T')[0];

    if (selectedDate !== todaysDate) {
      console.log("Check-in blocked: Selected date is not today.");
      this.isPastDay = true;
      return;
    }
    const payload = {
      "customerId": this.selectedCustomer.customerId,
      "checkinTime": new Date().toISOString(),
      "attendanceDate": todaysDate
    }
    console.log(payload);

    this.service.customerCheckIn(payload, false).subscribe((res: any) => {
      console.log("CheckIn successfull", res);
      if (res?.Results) {
        // this.getAllAttendance(false,true);
        this.attendanceList.forEach((x:any)=>{
          if(x.customerId == res?.Results?.customerId){debugger
            x.attendanceId = res?.Results?._id;
            x._id = res?.Results?._id;
            x.attendanceDate = res?.Results?.attendanceDate;
            x.checkinTime = res?.Results?.checkinTime;
            x.isPresent = true;
          }
        })
        const successMessage = 'Check-in successful';
        this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: successMessage });
      } else {
        console.warn('Unexpected response format:',res);
        this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: this.toastErrorMessage });
      }
    })
  }

  getOffsetHeightByCustomClass(extra: any = 0, customClasses:any[] = []){
    return getOffsetHeightByCustomClass(extra, customClasses);
  }

  onFilterClear() {
    this.filterFields = {
      branchId: null,
      ctr_Name: null,
      ctr_Code: null,
      ctr_MobileNo: null,
      ctr_WhatsAppNo: null,
      isPresent: null
    };
    this.getAllAttendance(true, true);
  }

  onScroll() {

    if ( this.xPagination?.hasNextPage) {
      this.pageNo++;

      this.getAllAttendance(false, false);
  }
}
}
