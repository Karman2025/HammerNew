import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { creditDebitOptions, paymentTypeMaster } from '../../../shared/data/master-data';
import { dateStringToObj } from '../../../shared/functions/date-string-to-obj';
import { AppComponentsApiService } from '../../app-components-api-service';


@Component({
  selector: 'app-accounts-add-edit-form',
  templateUrl: './accounts-add-edit-form.component.html',
  styleUrls: ['./accounts-add-edit-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule, SelectModule]
})
export class AccountsAddEditFormComponent implements OnInit {
  @Input() branchOptions:any[] = [];
  @Input() formDataMode: "view" | "edit" | "create" = "view";
  @Input() set accountsData(value: any) {
    if (value) {
      this.accountsFieldData = value;
      this.accountsFieldData.actionDate = dateStringToObj(this.accountsFieldData?.actionDate);
      this.loadCustomerFormData();
    }
  }
  get accountsData(): any {
    return this.accountsFieldData;
  }
  createAccountsForm!  : FormGroup;
  creditDebitOptions:any[] = creditDebitOptions;
  paymentTypeMaster:any[] = paymentTypeMaster;
  accountsFieldData: any;
  defaultValues = {
    amount: '',
    remarks: '',
    isCredit: null,
    paymentTypeId: null,
    branchId: null
  };
  loggedInUser:any;

  constructor(
    private fb: FormBuilder,
  ) {
    this.inItFormControl();

    // Listen for changes and update the object directly
    if(this.createAccountsForm){
      this.createAccountsForm.valueChanges.subscribe(updatedData => {
        if(updatedData && this.accountsFieldData){
          Object.assign(this.accountsFieldData, updatedData); // Modify the original object
        }
      });
    }
  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('USER-INFO') ?? "{}");
    if (this.loggedInUser?.role == '2') {
      this.createAccountsForm.patchValue({ branchId: this.loggedInUser._id });
      this.createAccountsForm.get('branchId')?.disable();
    }
  }

  inItFormControl(){
    this.createAccountsForm = this.fb.group({
      _id: new FormControl(''),
      amount: new FormControl('', [Validators.required]),
      remarks: new FormControl('', Validators.required),
      isCredit: new FormControl('', Validators.required),
      paymentTypeId: new FormControl('', Validators.required),
      branchId: new FormControl('', Validators.required),
    });
  }

  loadCustomerFormData() {
    if(this.formDataMode === 'view' || this.formDataMode ==='edit') {
      if(this.accountsFieldData) {
        this.createAccountsForm.patchValue(this.accountsFieldData);
      }
    } else if(this.formDataMode ==='create'){
      this.createAccountsForm.reset(this.defaultValues);
    }
  }

  isCreateAccountsFormValid(){
    if (this.createAccountsForm.valid) {
      return true;
    } else {
      this.createAccountsForm.markAllAsTouched();
      return false;
    }
  }
}
