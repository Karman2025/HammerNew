import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-branch-add-edit-form',
  templateUrl: './branch-add-edit-form.component.html',
  styleUrls: ['./branch-add-edit-form.component.css'],
  imports: [CommonModule,ReactiveFormsModule]
})
export class BranchAddEditFormComponent implements OnInit {

  @Input() set formDataMode(value: any){
    this.formMode = JSON.parse(JSON.stringify(value));
    console.log("child",JSON.parse(JSON.stringify(value)));

    if (this.formMode === 'view') {
      this.createBranchForm.disable();
    } else {
      this.createBranchForm.enable();
    }
  };
  @Input() set branchData(value: any) {
    if(value){
      this.branchFieldData = value;
      console.log("child",this.branchData);
      this.loadBranchFormData();
    }
  }
  get branchData():any {
    return this.branchFieldData;
  }
  formMode:"view" | "edit" | "create" = "view";
  createBranchForm!: FormGroup;
  branchImagePreview: string | ArrayBuffer | null = null;
  branchFieldData: any;
  defaultValues = {
    // profilePic: null,
    bch_Name: '',
    bch_Code: '',
    bch_MobileNo: '',
    bch_VatNumber: '',
    bch_Location: '',
    bch_Addresses: '',
    bch_Email: '',
    bch_Password: ''
  };

  constructor(private fb: FormBuilder) {
    this.inItFormControl();

    if(this.createBranchForm){
      this.createBranchForm.valueChanges.subscribe(updatedData => {
        if(updatedData && this.branchFieldData){
          Object.assign(this.branchFieldData, updatedData); // Modify the original object
        }
      });
    }
  }

  inItFormControl(){
    this.createBranchForm = this.fb.group({
      // profilePic: new FormControl(null, Validators.required),
      bch_Name: new FormControl('', Validators.required),
      bch_Code: new FormControl('',),
      bch_MobileNo: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
      bch_VatNumber: new FormControl('', Validators.required),
      bch_Location: new FormControl('', Validators.required),
      bch_Addresses: new FormControl('', Validators.required),
      bch_Email: new FormControl('', [Validators.required, Validators.email]),
      bch_Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  loadBranchFormData() {
    if(this.formMode === 'view' || this.formMode ==='edit') {
      if(this.branchFieldData) {
        this.createBranchForm.patchValue(this.branchFieldData);
      }
    }
    else if(this.formMode ==='create'){
      this.createBranchForm.reset(this.defaultValues);
    }
  }


  ngOnInit() {

  }

  onFormClear() {
    this.createBranchForm.reset(this.defaultValues);
  }


  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.branchImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  isCreateBranchFormValid(){
    console.log(this.createBranchForm)
    if (this.createBranchForm.valid) {
      return true;
    } else {
      this.createBranchForm.markAllAsTouched();
      return false;
    }
  }
}
