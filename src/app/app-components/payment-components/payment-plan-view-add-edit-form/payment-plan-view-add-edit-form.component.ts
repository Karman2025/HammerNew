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
      console.log(value)
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
    planStartDate: '',
    planEndDate: '',
    _id:''
  };
  selectedPaymentPlan:any = {};
  isVisiblePayBalanceDialog:boolean = false;
  showPayBalanceValidation:boolean = false;
  showPaymentMethodValidation:boolean = false;
  payBalanceValidationMsg:string = "";
  isVisibleCreatePaymentPlanDialog:boolean = false;
  isButtonLoading: boolean = false;
  paidAmountValidationMsg:string = 'Required';
  currentDate:Date = new Date();

  constructor(
    private fb: FormBuilder,
    private service: AppComponentsApiService,
    private toasterMessage: MessageService
  ) {
    this.inItFormControl();

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
      planStartDate: new FormControl(''),
      planEndDate: new FormControl(''),
    });

    this.createPaymentPlanForm.get('paymentPlanId')?.valueChanges.subscribe((value) => {
      const startDateControl = this.createPaymentPlanForm.get('planStartDate');
      const endDateControl = this.createPaymentPlanForm.get('planEndDate');

      if (value == 4) {
        startDateControl?.setValidators([Validators.required]);
        endDateControl?.setValidators([Validators.required]);
      } else {
        startDateControl?.clearValidators();
        endDateControl?.clearValidators();
      }

      startDateControl?.updateValueAndValidity();
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

  viewPaymentHistory(paymentHistory:any[]) {
    this.selectedPlanPaymentHistory = JSON.parse(JSON.stringify(paymentHistory));
    this.isVisiblePaymentHistoryDialog = true;
  }

  openPaymentPlanRenewModal(plan:any) {
    this.createPaymentPlanForm.reset(this.defaultValues);
    this.selectedPaymentPlan = JSON.parse(JSON.stringify(plan));
    this.isVisibleCreatePaymentPlanDialog = true;
  }



  createCustomerPaymentPlan(){
    // this.createPaymentPlanForm.get('paidAmount')?.setErrors(null);
    this.paidAmountValidationMsg = 'Required';
    if(this.createPaymentPlanForm?.value?.paidAmount > this.createPaymentPlanForm?.value?.payableAmount){
      this.paidAmountValidationMsg = 'Amount cannot exceed the payable amount';
      this.createPaymentPlanForm.get('paidAmount')?.setErrors({ customError: true });
    }

    this.createPaymentPlanForm.markAllAsTouched();
    if(this.createPaymentPlanForm?.valid){
      this.isButtonLoading = true;
      let customer = this.selectedPaymentPlan?.customer;
      let body = this.createPaymentPlanForm?.value;
      body.customerId = customer?._id;
      if(body?.paymentPlanId == '4'){
        body.planStartDate = dateObjToString(body?.planStartDate);
        body.planEndDate = dateObjToString(body?.planEndDate);
      }
      this.service.createCustomerPaymentPlan(this.createPaymentPlanForm?.value).subscribe((res:any)=>{
        console.log(res);
          if(res?.Results?.customerPaymentPlan){
            this.isVisibleCreatePaymentPlanDialog = false;
            if(this.IsCustomer){
              // let tempCustomerPaymentPlan = this.customerPaymentPlan?.filter((x:any)=>x?.customer?._id != customer?._id);
              res.Results.customerPaymentPlan.customer = customer;
              this.customerPaymentPlan?.unshift(res?.Results?.customerPaymentPlan);
              // this.customerPaymentPlan = JSON.parse(JSON.stringify(tempCustomerPaymentPlan));
              const successMessage = 'Customer payment plan created successfully'
              this.toasterMessage.add({ key: 'root-toast', severity: 'success', summary: 'Success', detail: successMessage });
            } else {
              res.Results.customerPaymentPlan.customer = customer;
              const index = this.customerPaymentPlan?.findIndex((x: any) => x?.customer?._id == customer?._id);
              if (index !== -1 && index != null) {
                this.customerPaymentPlan[index] = JSON.parse(JSON.stringify(res.Results.customerPaymentPlan));
              }
            }
            this.changeShowExtendPlan.emit(false);
          } else {
             this.toasterMessage.add({ key: 'root-toast', severity: 'error', summary: 'Error', detail: res?.Results?.error ?? 'Something went wrong please try again later' });
          };
          this.isButtonLoading = false;
        })
    }
  }

  openPayBalanceAmountDialog(plan:any){
    this.selectedPaymentPlan = JSON.parse(JSON.stringify(plan));
    this.isVisiblePayBalanceDialog = true;

    this.showPayBalanceValidation = false;
    this.showPaymentMethodValidation = false;
  }

  savePayBalanceAmount() {
    this.showPayBalanceValidation = false;
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
    if(this.showPayBalanceValidation == false && this.showPaymentMethodValidation == false) {
      this.isButtonLoading = true;
      let body = {
        customerId: this.selectedPaymentPlan?.customer?._id,
        payBalancePaymentMethod: this.selectedPaymentPlan?.payBalancePaymentMethod,
        payBalanceAmount: this.selectedPaymentPlan?.payBalanceAmount,
        _id: this.selectedPaymentPlan?._id
      }
      this.service.updateCustomerPaymentPlan(body).subscribe((res:any)=>{
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
}
