import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { paymentPlanOptions, paymentMethodsOptions } from '../../../shared/data/master-data';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { AppComponentsApiService } from '../../app-components-api-service';
import { getOffsetHeightForModal, getOffsetHeightForPrimaryTable } from '../../../shared/functions/calcHeightOffset';
import { DatePicker } from 'primeng/datepicker';
import { dateObjToString, dateStringToObj } from '../../../shared/functions/date-string-to-obj';
import { MessageService } from 'primeng/api';
import { getPopupWidth } from '../../../shared/functions/responsiveFunction';

@Component({
  selector: 'app-payment-plan-view-add-edit-form',
  templateUrl: './payment-plan-view-add-edit-form.component.html',
  styleUrls: ['./payment-plan-view-add-edit-form.component.css'],
  imports: [TableModule, CommonModule, SelectModule, DialogModule, ReactiveFormsModule, TooltipModule, FormsModule, DatePicker]

})
export class PaymentPlanViewAddEditFormComponent implements OnInit {

  @Input() set CustomerPaymentPlan(value:any[]) {
    if(value){
      this.customerPaymentPlan = value;
    }
  }

  @Input() set CustomerFormPaymentPlanData(value:any){
    this.customerFormPaymentPlanData = value;
    this.createPaymentPlanForm.reset(this.defaultValues);
  }

  @Input() IsCustomer:boolean = false;

  get CustomerFormPaymentPlanData(): any {
    return this.customerFormPaymentPlanData;
  }

  @Input() formMode:"view" | "edit" | "create" = "view";

  @Output() changeShowExtendPlan =  new EventEmitter<boolean>();

  selectedPlanPaymentHistory:any[] = [];
  isVisiblePaymentHistoryDialog:boolean = false;
  customerPaymentPlan:any[] = [];
  paymentPlanOptions:any[] = paymentPlanOptions;
  paymentMethodsOptions:any[] = paymentMethodsOptions;
  createPaymentPlanForm!: FormGroup;
  customerFormPaymentPlanData:any;
  defaultValues = {
    paymentPlanId: '',
    payableAmount: '',
    paidAmount: '',
    paymentMethod: '',
    receiptNumber: '',
    planStartDate: '',
    planEndDate: '',
    _id:''
  };
  selectedPaymentPlan:any = {};
  isVisiblePayBalanceDialog:boolean = false;
  showPayBalanceValidation:boolean = false;
  showReceiptNumberValidation:boolean = false;
  showPaymentMethodValidation:boolean = false;
  payBalanceValidationMsg:string = "";
  isVisibleAddUpdatePaymentPlanDialog:boolean = false;
  isButtonLoading: boolean = false;
  isPaymentPlanButtonLoading: boolean = false;
  paidAmountValidationMsg:string = 'Required';
  currentDate:Date = new Date();
  popupWidth = getPopupWidth();
  isVisibleFreezeCustomerModal:boolean = false;
  showFreezeDateValidationMsg:boolean = false;
  disablePlanFreezeUnfreeze:boolean = false;
  planFreezeDate:any;
  freezeUnfreezeActionType:string = "";
  isVisibleUnFreezeCustomerModal:boolean = false;
  showUnFreezeDateValidationMsg:boolean = false;
  disablePlanUnFreeze:boolean = false;
  planUnFreezeDate:any;
  loggedInUser:any = {};

  constructor(
    private fb: FormBuilder,
    private service: AppComponentsApiService,
    private toasterMessage: MessageService
  ) {
    this.inItFormControl();
    this.loggedInUser = JSON.parse(localStorage.getItem('USER-INFO') ?? "{}");

    // Listen for changes and update the object directly
    if(this.createPaymentPlanForm){
      this.createPaymentPlanForm.valueChanges.subscribe(updatedData => {
        if(updatedData && this.customerFormPaymentPlanData){
          Object.assign(this.customerFormPaymentPlanData, updatedData); // Modify the original object
        }
      });
    }
  }

  ngOnInit() {
  }

  inItFormControl() {
    this.createPaymentPlanForm = this.fb.group({
      _id: new FormControl(''),
      paymentPlanId: new FormControl('', Validators.required),
      payableAmount: new FormControl('', Validators.required),
      paidAmount: new FormControl('', Validators.required),
      paymentMethod: new FormControl('', Validators.required),
      receiptNumber: new FormControl('', Validators.required),
      planStartDate: ['', Validators.required],
      planEndDate: new FormControl(''),
    });

    this.createPaymentPlanForm.get('paymentPlanId')?.valueChanges.subscribe((value) => {
      const endDateControl = this.createPaymentPlanForm.get('planEndDate');

      if (value == 4) {
        endDateControl?.setValidators([Validators.required]);
      } else {
        endDateControl?.clearValidators();
      }
      endDateControl?.updateValueAndValidity();
    });
  }

  isCreateCustomerFormValid() {
    if (this.createPaymentPlanForm.valid) {
      return true;
    } else {
      this.createPaymentPlanForm.markAllAsTouched();
      return false;
    }
  }

  onPaymentPlanChange(){
    this.createPaymentPlanForm.get('planStartDate')?.setValue('');
    this.createPaymentPlanForm.get('planEndDate')?.setValue('');
  }

  viewPaymentHistory(paymentHistory:any[]) {
    this.selectedPlanPaymentHistory = JSON.parse(JSON.stringify(paymentHistory));
    this.isVisiblePaymentHistoryDialog = true;
  }

  openPaymentPlanRenewModal(plan:any) {
    this.createPaymentPlanForm.reset(this.defaultValues);
    this.selectedPaymentPlan = JSON.parse(JSON.stringify(plan));
    this.isVisibleAddUpdatePaymentPlanDialog = true;
    this.enableDisabledFieldsEditPlan();
  }

  editPaymentPlan(plan:any) {
    plan.planStartDate = dateStringToObj(plan?.planStartDate);
    plan.planEndDate = dateStringToObj(plan?.planEndDate);
    plan.paymentMethod = plan?.payments[plan?.payments?.length - 1]?.paymentMethod;
    plan.receiptNumber = plan?.payments?.[0]?.receiptNumber;

    this.createPaymentPlanForm.reset(plan);
    this.selectedPaymentPlan = JSON.parse(JSON.stringify(plan));
    this.isVisibleAddUpdatePaymentPlanDialog = true;
    this.createPaymentPlanForm.get('payableAmount')?.disable();
    this.createPaymentPlanForm.get('paidAmount')?.disable();
    this.createPaymentPlanForm.get('paymentMethod')?.disable();
    this.createPaymentPlanForm.get('receiptNumber')?.disable();
  }

  addUpdateCustomerPaymentPlan() {
    this.paidAmountValidationMsg = 'Required';
    if (this.createPaymentPlanForm?.value?.paidAmount > this.createPaymentPlanForm?.value?.payableAmount) {
      this.paidAmountValidationMsg = 'Amount cannot exceed the payable amount';
      this.createPaymentPlanForm.get('paidAmount')?.setErrors({ customError: true });
    }

    this.createPaymentPlanForm.markAllAsTouched();
    if (this.createPaymentPlanForm?.valid) {
      let customer = this.selectedPaymentPlan?.customer;
      let body = this.createPaymentPlanForm?.getRawValue();
      body.customerId = customer?._id;


      if (body?.planStartDate) {
        body.planStartDate = dateObjToString(body?.planStartDate);
      }

      if (body?.paymentPlanId == '4') {
        body.planEndDate = dateObjToString(body?.planEndDate);
      }

      this.isPaymentPlanButtonLoading = true;
      if(!body?._id || body?._id == '' || body?._id == null || body?._id == undefined) {
        this.service.createCustomerPaymentPlan(body).subscribe((res: any) => {
          this.isPaymentPlanButtonLoading = false;
          if (res?.Results?.customerPaymentPlan) {
            this.isVisibleAddUpdatePaymentPlanDialog = false;
            const successMessage = 'Customer payment plan created successfully'
            this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: successMessage });
            if (this.IsCustomer) {
              let tempCustomerPaymentPlan = this.customerPaymentPlan?.filter((x: any) => x?.customer?._id == customer?._id);
              res.Results.customerPaymentPlan.customer = customer;
              tempCustomerPaymentPlan?.unshift(res?.Results?.customerPaymentPlan);
              this.customerPaymentPlan = JSON.parse(JSON.stringify(tempCustomerPaymentPlan));
            } else {
              res.Results.customerPaymentPlan.customer = customer;
              const index = this.customerPaymentPlan?.findIndex((x: any) => x?.customer?._id == customer?._id);
              if (index !== -1 && index != null) {
                this.customerPaymentPlan[index] = JSON.parse(JSON.stringify(res?.Results?.customerPaymentPlan));
              }
            }
            this.changeShowExtendPlan.emit(false);
          } else {
            this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: res?.Results?.error ?? 'Something went wrong please try again later' });
          }
        });
      } else {
        this.service.updateCustomerPaymentPlan(body).subscribe((res: any) => {
          this.isPaymentPlanButtonLoading = false;
          if (res?.Results?.customerPaymentPlan) {
            this.isVisibleAddUpdatePaymentPlanDialog = false;
            let tempCustomerPaymentPlanId = this.customerPaymentPlan?.findIndex((x:any)=> x._id == res?.Results?.customerPaymentPlan?._id);
            this.customerPaymentPlan[tempCustomerPaymentPlanId] = res?.Results?.customerPaymentPlan;
            const successMessage = 'Customer payment plan updated successfully'
            this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: successMessage });
            this.enableDisabledFieldsEditPlan();
            this.changeShowExtendPlan.emit(false);
          } else {
            this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: res?.Results?.error ?? 'Something went wrong please try again later' });
          }
        });
      }
    }
  }

  enableDisabledFieldsEditPlan(){
    this.createPaymentPlanForm.get('payableAmount')?.enable();
    this.createPaymentPlanForm.get('paidAmount')?.enable();
    this.createPaymentPlanForm.get('paymentMethod')?.enable();
    this.createPaymentPlanForm.get('receiptNumber')?.enable();
  }

  getMinEndDate() {
    const startDate = this.createPaymentPlanForm.get('planStartDate')?.value;
    if (startDate instanceof Date) {
      return startDate;
    } else if (typeof startDate === 'string') {
      return new Date(startDate);
    }
    return new Date(); // fallback to current date
  }

  openPayBalanceAmountDialog(plan:any){
    this.selectedPaymentPlan = JSON.parse(JSON.stringify(plan));
    this.isVisiblePayBalanceDialog = true;

    this.showPayBalanceValidation = false;
    this.showReceiptNumberValidation = false;
    this.showPaymentMethodValidation = false;
  }

  savePayBalanceAmount() {
    this.showPayBalanceValidation = false;
    this.showReceiptNumberValidation = false;
    this.showPaymentMethodValidation = false;

    if(this.selectedPaymentPlan?.payBalanceAmount == undefined || this.selectedPaymentPlan?.payBalanceAmount == null || this.selectedPaymentPlan?.payBalanceAmount == 0 || !this.selectedPaymentPlan?.payBalanceAmount){
      this.showPayBalanceValidation = true;
      this.payBalanceValidationMsg = 'Required';
    }
    if(this.selectedPaymentPlan?.payBalanceAmount > this.selectedPaymentPlan?.balanceAmount){
      this.showPayBalanceValidation = true;
      this.payBalanceValidationMsg = 'Amount exceeds balance';
    }
    if(this.selectedPaymentPlan?.payBalancePaymentMethod == undefined || this.selectedPaymentPlan?.payBalancePaymentMethod == null || this.selectedPaymentPlan?.payBalancePaymentMethod == 0 || !this.selectedPaymentPlan?.payBalancePaymentMethod){
      this.showPaymentMethodValidation = true;
    }
    if(this.selectedPaymentPlan?.receiptNumber == undefined || this.selectedPaymentPlan?.receiptNumber == null || this.selectedPaymentPlan?.receiptNumber == 0 || !this.selectedPaymentPlan?.receiptNumber){
      this.showReceiptNumberValidation = true;
    }
    if(this.showPayBalanceValidation == false && this.showPaymentMethodValidation == false && this.showReceiptNumberValidation == false) {
      this.isButtonLoading = true;
      let body = {
        customerId: this.selectedPaymentPlan?.customer?._id,
        payBalancePaymentMethod: this.selectedPaymentPlan?.payBalancePaymentMethod,
        payBalanceAmount: this.selectedPaymentPlan?.payBalanceAmount,
        receiptNumber: this.selectedPaymentPlan?.receiptNumber,
        _id: this.selectedPaymentPlan?._id
      }
      this.service.payCustomerBalancePaymentPlan(body).subscribe((res:any)=>{
        if(res?.Results?.message == 'Customer payment plan updated successfully'){
          this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: 'Payment completed successfully' });
          this.isVisiblePayBalanceDialog = false;
          this.customerPaymentPlan?.forEach((x:any)=>{
            if(x?._id == this.selectedPaymentPlan?._id){
              x.paidAmount = res?.Results?.customerPaymentPlan?.paidAmount;
              x.balanceAmount = res?.Results?.customerPaymentPlan?.balanceAmount;
              x.paymentStatus = res?.Results?.customerPaymentPlan?.paymentStatus;
              res.Results.customerPaymentPlan.newPayment.customerPaymentPlanId = x?._id;
                x.payments?.push(res?.Results?.customerPaymentPlan?.newPayment);
            }
          })
          if(this.customerPaymentPlan?.filter((x:any)=>x.paymentStatus == 'Completed')?.length == this.customerPaymentPlan?.length){
            this.changeShowExtendPlan.emit(true);
          }
        } else {
          this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: res?.Results?.error ?? 'Something went wrong please try again later' });
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

  openFreezePaymentPlanModal(plan:any) {
    this.selectedPaymentPlan = JSON.parse(JSON.stringify(plan));
    this.isVisibleFreezeCustomerModal = true;
    this.freezeUnfreezeActionType = "freeze";
    this.showFreezeDateValidationMsg = false;
    this.planFreezeDate = null;
  }

  openUnFreezePaymentPlanModal(plan:any) {
    this.selectedPaymentPlan = JSON.parse(JSON.stringify(plan));
    this.selectedPaymentPlan.freezeDate = dateStringToObj(this.selectedPaymentPlan?.freezeDate);
    this.isVisibleUnFreezeCustomerModal = true;
    this.freezeUnfreezeActionType = "unfreeze";
    this.showUnFreezeDateValidationMsg = false;
    this.planUnFreezeDate = null;
  }

  freezeUnfreezeCustomerPaymentPlan(){
    this.showFreezeDateValidationMsg = false;
    this.showUnFreezeDateValidationMsg = false;
    if(
      this.freezeUnfreezeActionType == 'freeze' ? (this.planFreezeDate != null && this.planFreezeDate != undefined && this.planFreezeDate) : true &&
      this.freezeUnfreezeActionType == 'unfreeze' ? (this.planUnFreezeDate != null && this.planUnFreezeDate != undefined && this.planUnFreezeDate) : true
    ) {
      let body:any = {
        customerPaymentPlanId: this.selectedPaymentPlan?._id,
        actionType: this.freezeUnfreezeActionType
      }
      if(this.freezeUnfreezeActionType == 'freeze'){
        body.freezeDate = this.planFreezeDate;
      } else if(this.freezeUnfreezeActionType == 'unfreeze'){
        body.unfreezeDate = this.planUnFreezeDate;
      }
      this.disablePlanFreezeUnfreeze = true;
      this.service.freezeUnfreezeCustomerPaymentPlan(body).subscribe((res:any) => {
        if(res?.Results?.customerPaymentPlan?._id){
          if(this.freezeUnfreezeActionType == 'freeze'){
            this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: 'Payment paused successfully' });
            this.isVisibleFreezeCustomerModal = false;
          } else if(this.freezeUnfreezeActionType == 'unfreeze'){
            this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: 'Payment Resumed successfully' });
            this.isVisibleUnFreezeCustomerModal = false;
          }
          this.customerPaymentPlan?.forEach((x:any)=>{
            if(x?._id == this.selectedPaymentPlan?._id){
              x.paymentStatus = res?.Results?.customerPaymentPlan?.paymentStatus;
              x.daysLeftAfterFreeze = res?.Results?.customerPaymentPlan?.daysLeftAfterFreeze;
              x.freezeDate = res?.Results?.customerPaymentPlan?.freezeDate ?? null;
              x.unfreezeDate = res?.Results?.customerPaymentPlan?.unfreezeDate ?? null;
              x.planEndDate = res?.Results?.customerPaymentPlan?.planEndDate ?? null;
              x.freezeDate = res?.Results?.customerPaymentPlan?.freezeDate ?? null;
              x.planEndsIn = res?.Results?.customerPaymentPlan?.planEndsIn ?? null;
            }
          })
        } else {
          this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: res?.Results?.error ?? 'Something went wrong please try again later' });
        }
      this.disablePlanFreezeUnfreeze = false;
      })
    } else {
      if(this.freezeUnfreezeActionType == 'freeze'){
        this.showFreezeDateValidationMsg = true;
      } else if(this.freezeUnfreezeActionType == 'unfreeze'){
        this.showUnFreezeDateValidationMsg = true;
      }
    }
  }

}
