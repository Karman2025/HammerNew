import { filter } from 'rxjs';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppComponentsApiService } from '../../app-components-api-service';
import { CustomerAddEditFormComponent } from '../customer-add-edit-form/customer-add-edit-form.component';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { getOffsetHeightByCustomClass, getOffsetHeightForCard, getOffsetHeightForModal } from '../../../shared/functions/calcHeightOffset';
import { dateObjToString } from '../../../shared/functions/date-string-to-obj';
import { MessageService } from 'primeng/api';
import { DietPlanAddEditFormComponent } from '../diet-plan-add-edit-form/diet-plan-add-edit-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { paymentPlanOptions } from '../../../shared/data/master-data';
import { PaymentPlanViewAddEditFormComponent } from '../../payment-components/payment-plan-view-add-edit-form/payment-plan-view-add-edit-form.component';
import { getPopupWidth } from '../../../shared/functions/responsiveFunction';

@Component({
  selector: 'app-customer-detailed-view',
  templateUrl: './customer-detailed-view.component.html',
  styleUrls: ['./customer-detailed-view.component.css'],
  imports: [CustomerAddEditFormComponent, DialogModule, CommonModule, DietPlanAddEditFormComponent, TableModule, PaymentPlanViewAddEditFormComponent]
})
export class CustomerDetailedViewComponent implements OnInit {

  @ViewChild('CustomerAddEditFormComponent', { static: false })
    customerAddEditFormComponent!: CustomerAddEditFormComponent;

  @ViewChild('DietPlanAddEditFormComponent', { static: false })
    dietPlanAddEditFormComponent!: DietPlanAddEditFormComponent;

  @ViewChild('PaymentPlanViewAddEditFormComponent', {static: false})
    paymentPlanViewAddEditFormComponent!: PaymentPlanViewAddEditFormComponent;

  @Input() set CustomerId(value:any){
    this.customerId = value;
    this.getCustomerDetailsById(value);
  }
  @Input() branchOptions:any[] = [];
  @Input() formMode:"view" | "edit" | "create" = "view";
  @Input() dietPlanFormMode:"view" | "edit" | "create" = "view";

  customerDetails:any = {};
  isVisibleCustomerEditDialog:boolean = false;
  isVisibleDietPlanDialog:boolean = false;
  isButtonLoading: boolean = false;
  toastErrorMessage: string = 'Something went wrong';
  customerData:any = {};
  isSaving: boolean = false;
  customerDietPlan:any[] = [];
  customerId:any;
  containerOffSetHeightClasses:any[] = ['ofH_calc_nav_bar', 'ofH_calc_body_header', 'ofH_calc_customer_detaile_nav'];
  paymentPlanOptions:any[] = paymentPlanOptions;
  customerFormPaymentPlanData:any = {};
  popupWidth = getPopupWidth();
  loggedInUser: any = {};


  constructor(
    private service: AppComponentsApiService,
    private toasterMessage: MessageService,
    private route: ActivatedRoute
  ) {
    this.getAllBranchAutocompleteData();
    this.loggedInUser = JSON.parse(localStorage.getItem('USER-INFO') ?? "{}");

  }

  ngOnInit() {
    // this.route.queryParams.subscribe(params => {
    //   this.customerId = params['customerId'];
    //   this.getCustomerDetailsById(this.customerId);
    // });
  }

  getCustomerDetailsById(customerId:any){
    this.service.getCustomerDetailsById(customerId).subscribe((res:any)=>{
      // res?.paymentPlan?.forEach((x:any)=>{
      //   x.status = x?.payableAmount > x?.paidAmount ? 'Pending' : 'Completed'
      // })
      this.customerData.showExtendPlan = res?.paymentPlan?.filter((x:any)=>x.paymentStatus == 'Completed')?.length == res?.paymentPlan?.length || res?.paymentPlan?.length == 0;
      this.customerDetails = JSON.parse(JSON.stringify(res));
      // console.log(res);

      if(!this.customerDetails?.paymentPlan || !this.customerDetails?.paymentPlan?.length || this.customerDetails?.paymentPlan?.length == 0){
        this.addPaymentPlan();
      }
    })
  }

  onCustomerInfoEdit(){
    this.formMode = "edit";
    this.customerData = JSON.parse(JSON.stringify(this.customerDetails?.customerInfo))
    this.isVisibleCustomerEditDialog = true;
  }

  // onCustomerUpdate() {
  //   let formData:any = JSON.parse(JSON.stringify(this.customerData));
  //   let isCreateCustomerFormValid:any = this.customerAddEditFormComponent.isCreateCustomerFormValid();
  //   if(isCreateCustomerFormValid){
  //     this.isButtonLoading =  true;
  //     formData.ctr_Dob = dateObjToString(formData?.ctr_Dob);
  //       this.service.updateCustomer(formData).subscribe((res:any) => {
  //         if (res?.Results && res?.Results?.error) {
  //           const errorMessage = res?.Results?.error;
  //           this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: errorMessage });
  //         } else {
  //           this.isVisibleCustomerEditDialog = false;
  //           this.getCustomerDetailsById(this.customerId);
  //           const successMessage = 'Customer updated successfully!'
  //           this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: successMessage });
  //         };
  //         this.isButtonLoading = false;
  //       })
  //   }
  // }

onCustomerUpdate() {
  let formData:any = JSON.parse(JSON.stringify(this.customerData));
  let isCreateCustomerFormValid:any = this.customerAddEditFormComponent.isCreateCustomerFormValid();

  if(isCreateCustomerFormValid){
    this.isSaving = true;
    formData.ctr_Dob = dateObjToString(formData?.ctr_Dob);

    this.service.updateCustomer(formData).subscribe({
      next: (res:any) => {
        if (res?.Results && res?.Results?.error) {
          const errorMessage = res?.Results?.error;
          this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: errorMessage });
        } else {
          this.isVisibleCustomerEditDialog = false;
          this.getCustomerDetailsById(this.customerId);
          const successMessage = 'Customer updated successfully!'
          this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: successMessage });
        }
      },
      error: (error) => {
        this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: 'Failed to update customer' });
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  } else {
    this.isSaving = false;
  }
}

  getOffsetHeightForModal(extra: any = 0) {
    return getOffsetHeightForModal(extra);
  }

  getOffsetHeightByCustomClass(extra: any = 0, customClasses:any[] = []){
    return getOffsetHeightByCustomClass(extra, customClasses);
  }

  editDietPlan(){
    this.isVisibleDietPlanDialog = true;
    this.dietPlanFormMode = 'edit';
    this.customerDietPlan = JSON.parse(JSON.stringify(this.customerDetails?.customerDietPlan));
  }

  addDietPlan(){
    this.isVisibleDietPlanDialog = true;
    this.dietPlanFormMode = 'create';
    this.customerDietPlan = [];
  }

  onDietPlanSubmit() {
    let isValid = this.dietPlanAddEditFormComponent?.validateAllFormFields();
    if(isValid){
      this.isButtonLoading = true;
      this.customerDietPlan.forEach((x:any)=>x.customerId = this.customerId);
      this.service.addUpdateDietPlans(this.customerDietPlan).subscribe((res:any)=>{
        if(res?.Results?.message == "Diet plan updated successfully"){
          this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: 'Diet Plan updated successfully' });
          this.isVisibleDietPlanDialog = false;
          this.customerDetails.customerDietPlan = [];
          setTimeout(()=>{
            this.customerDetails.customerDietPlan = JSON.parse(JSON.stringify(res?.Results?.response));
          })
        } else {
          this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: res?.Results?.error ?? 'Something went wrong please try again later' });
        };
        this.isButtonLoading = false;
      })
    }
  }

  addPaymentPlan(){
    let res:any = this.paymentPlanViewAddEditFormComponent.openPaymentPlanRenewModal({customer:{_id: this.customerId}});
    if(res?.Results?.customerPaymentPlan){
    }
  }

  changeShowExtendPlan(event:any){
    this.customerData.showExtendPlan = event;
  }
  getAllBranchAutocompleteData() {
    this.service.getAllBranchAutocompleteData().subscribe((res: any) => {
      if (res && res?.length > 0) {
        this.branchOptions = res;
      } else {
        console.warn('Unexpected response format:', res);
        this.branchOptions = [];
      }
      // console.log(this.branchOptions)
    });
  }
}
