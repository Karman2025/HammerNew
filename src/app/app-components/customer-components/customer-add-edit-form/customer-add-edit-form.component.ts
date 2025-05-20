import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { dateStringToObj } from '../../../shared/functions/date-string-to-obj';
import { paymentPlanOptions } from '../../../shared/data/master-data';


@Component({
  selector: 'app-customer-add-edit-form',
  templateUrl: './customer-add-edit-form.component.html',
  styleUrls: ['./customer-add-edit-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule, SelectModule, DatePickerModule]
})
export class CustomerAddEditFormComponent implements OnInit {

  @Input() set formDataMode(value: any) {
    this.formMode = JSON.parse(JSON.stringify(value));
    if (this.formMode === 'view') {
      this.createCustomerForm.disable();
    } else {
      this.createCustomerForm.enable();
    }
  }
  @Input() branchOptions: { _id: string, bch_Name: string, bch_Code: string }[]=[];
  @Input() set customerData(value: any) {
    if (value) {
      this.customerFieldData = value;
      this.customerFieldData.ctr_Dob = dateStringToObj(this.customerFieldData?.ctr_Dob);
      this.loadCustomerFormData();
    }
  }
  get customerData(): any {
    return this.customerFieldData;
  }

  formMode:"view" | "edit" | "create" = "view";
  createCustomerForm!  : FormGroup;
  customerFieldData: any;
  defaultValues = {
    ctr_Name: '',
    ctr_Code: '',
    ctr_Email: '',
    ctr_MobileNo: '',
    ctr_Addresses: '',
    ctr_Dob: '',
    ctr_WhatsAppNo: '',
    ctr_Height: '',
    ctr_Weight: '',
    ctr_CustomPaymentPlanStartDate: null,
    ctr_CustomPaymentPlanEndDate: null,
    branch: null,
    branchId: null
  };
  paymentPlanOptions:any[] = paymentPlanOptions;
  loggedInUser:any;
  constructor(
    private fb: FormBuilder,
  ) {
    this.inItFormControl();

    // Listen for changes and update the object directly
    if(this.createCustomerForm){
      this.createCustomerForm.valueChanges.subscribe(updatedData => {
        if(updatedData && this.customerFieldData){
          Object.assign(this.customerFieldData, updatedData); // Modify the original object
        }
      });
    }
  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('USER-INFO') ?? "{}");
    if (this.loggedInUser?.role == '2') {
      this.createCustomerForm.patchValue({ branchId: this.loggedInUser._id });
      this.createCustomerForm.get('branchId')?.disable();
    }
  }

  inItFormControl(){
    this.createCustomerForm = this.fb.group({
      _id: new FormControl(''),
      ctr_Code: new FormControl({ value: '', disabled: true }),
      ctr_Name: new FormControl('', Validators.required),
      ctr_Email: new FormControl('', [Validators.required, Validators.email]),
      ctr_MobileNo: new FormControl('', Validators.required),
      ctr_Addresses: new FormControl('', Validators.required),
      ctr_Dob: new FormControl('', Validators.required),
      ctr_WhatsAppNo: new FormControl('', Validators.required),
      ctr_Height: new FormControl('', Validators.required),
      ctr_Weight: new FormControl('', Validators.required),
      ctr_CustomPaymentPlanStartDate: new FormControl(''),
      ctr_CustomPaymentPlanEndDate: new FormControl(''),
      branchId: new FormControl(null, Validators.required),
    });
  }

  loadCustomerFormData() {
    if(this.formMode === 'view' || this.formMode ==='edit') {
      if(this.customerFieldData) {
        console.log(this.customerFieldData);
        
        this.createCustomerForm.patchValue(this.customerFieldData);
      }
    } else if(this.formMode ==='create'){
      this.createCustomerForm.reset(this.defaultValues);
    }
  }

  onFormClear() {
    this.createCustomerForm.reset(this.defaultValues);
  }

  isCreateCustomerFormValid(){
    if (this.createCustomerForm.valid) {
      return true;
    } else {
      this.createCustomerForm.markAllAsTouched();
      return false;
    }
  }
}
