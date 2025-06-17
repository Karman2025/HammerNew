import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-trainer-add-edit-form',
  imports: [CommonModule, ReactiveFormsModule, SelectModule],
  templateUrl: './trainer-add-edit-form.component.html',
  styleUrl: './trainer-add-edit-form.component.css'
})
export class TrainerAddEditFormComponent {

  @Input() set formDataMode(value: any) {
    this.formMode = JSON.parse(JSON.stringify(value));
    if (this.formMode === 'view') {
      this.createTrainerForm.disable();
    } else {
      this.createTrainerForm.enable();
    }
  }
  @Input() branchOptions: { _id: string, bch_Name: string, bch_Code: string }[]=[];
  @Input() set trainerData(value: any) {
    // console.log("childTrainerValue",value);

    if (value) {
      this.trainerFieldData = value;
      // console.log("child trainer",this.trainerData);
      this.loadTrainerFormData();
    }
  }
  get trainerData(): any {
    return this.trainerFieldData;
  }

  formMode:"view" | "edit" | "create" = "view";
  createTrainerForm!  : FormGroup
  trainerFieldData: any;
  // filteredBranch: any[] = [];
  defaultValues = {
    tnr_Name: '',
    branchId: '',
    tnr_MobileNo: '',
    tnr_Addresses: '',
    tnr_Email: '',
    bch_Password: '',
    branch: null
  };
  loggedInUser:any;

  constructor(private fb: FormBuilder) {
    this.inItFormControl();

      // Listen for changes and update the object directly
      if(this.createTrainerForm){
        this.createTrainerForm.valueChanges.subscribe(updatedData => {
          if(updatedData && this.trainerFieldData){
            Object.assign(this.trainerFieldData, updatedData); // Modify the original object
          }
        });
      }
  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('USER-INFO') ?? "{}");
    if (this.loggedInUser?.role == '2') {
      this.createTrainerForm.patchValue({ branchId: this.loggedInUser._id });
      this.createTrainerForm.get('branchId')?.disable();
    }
  }

  inItFormControl(){
    this.createTrainerForm = this.fb.group({
      _id: new FormControl(''),
      tnr_Name: new FormControl('', Validators.required),
      tnr_MobileNo: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
      tnr_Addresses: new FormControl('', Validators.required),
      tnr_Email: new FormControl('', [Validators.required, Validators.email]),
      branchId: new FormControl(null, Validators.required),
      tnr_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/)
      ])
    });
  }

  loadTrainerFormData() {
    if(this.formMode === 'view' || this.formMode ==='edit') {
      // console.log(this.trainerFieldData)
      if(this.trainerFieldData) {
        this.createTrainerForm.patchValue(this.trainerFieldData);
      }
    } else if(this.formMode ==='create'){
      this.createTrainerForm.reset(this.defaultValues);
    }
  }

  onFormClear() {
    this.createTrainerForm.reset(this.defaultValues);
  }

  // filterBranch(event: any) {
  //   const query = event.query.toLowerCase();
  //   this.filteredBranch = this.branchOptions.filter(val =>
  //     val.bch_Name.toLowerCase().includes(query)
  //   );
  // }

  isCreateTrainerFormValid(){
    // console.log(this.createTrainerForm)
    if (this.createTrainerForm.valid) {
      return true;
    } else {
      this.createTrainerForm.markAllAsTouched();
      return false;
    }
  }

  // logFormErrors() {
  //   const controls = this.createTrainerForm.controls;

  //   for (const controlName in controls) {
  //     if (controls[controlName].invalid) {
  //       console.log(`Control ${controlName} is invalid`);
  //       console.log(controls[controlName].errors);  // Log the exact errors on this control
  //     }
  //   }
  // }

}
