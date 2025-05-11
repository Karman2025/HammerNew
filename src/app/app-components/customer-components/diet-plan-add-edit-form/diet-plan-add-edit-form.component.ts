import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-diet-plan-add-edit-form',
  templateUrl: './diet-plan-add-edit-form.component.html',
  styleUrls: ['./diet-plan-add-edit-form.component.css'],
  imports: [CommonModule,ReactiveFormsModule]
})
export class DietPlanAddEditFormComponent implements OnInit {

  get dietPlans() {
    return this.createDietPlanForm.get('dietPlans') as FormArray;
  }

  @Input() dietPlanFormMode:"view" | "edit" | "create" = "view";

  @Input() set customerDietPlan(value:any){
    if(value){
      this.customerDietPlanData = value;
    }
    if (value?.length === 0) {
      setTimeout(() => {
        if (this.createDietPlanForm) {
          this.onAddDietPlan();
        }
      });
    }
  }

  get customerDietPlan(): any {
    return this.customerDietPlanData;
  }

  createDietPlanForm!: FormGroup;
  customerDietPlanData:any[] = [];


  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createDietPlanForm = this.fb.group({
      dietPlans: this.fb.array([])
    });

    this.customerDietPlanData.forEach((plan:any) => {
      this.dietPlans.push(this.createDietPlanGroup(plan));
    });

    this.createDietPlanForm.valueChanges.subscribe(() => {
      const updatedData = this.createDietPlanForm.getRawValue(); // includes disabled fields


      if (updatedData?.dietPlans && this.customerDietPlanData) {
        Object.assign(this.customerDietPlanData, updatedData.dietPlans);
      }
    });

  }

  createDietPlanGroup(data: any): FormGroup {
    return this.fb.group({
      _id: [data._id || null],
      dietKey: [{ value: data.dietKey, disabled: true }, Validators.required],
      dietValue: [{ value: data.dietValue, disabled: true }, Validators.required],
      isEdit: [data.isEdit],
      isDeleted: [data.isDeleted],
      cloneData: [data.cloneData || null]
    });
  }

  onAddDietPlan() {
    const group = this.fb.group({
      _id: [null],
      dietKey: [{ value: '', disabled: false }, Validators.required],
      dietValue: [{ value: '', disabled: false }, Validators.required],
      isEdit: [true],
      isDeleted: [false],
      cloneData: [null]
    });
    this.dietPlans.push(group);
  }

  onEdit(index: number) {
    const control = this.dietPlans.at(index);
    const clone = {
      dietKey: control.get('dietKey')?.value,
      dietValue: control.get('dietValue')?.value
    };

    control.get('cloneData')?.setValue(clone);
    control.get('isEdit')?.setValue(true);
    control.get('dietKey')?.enable();
    control.get('dietValue')?.enable();
  }


  onDelete(index: number) {
    const control = this.dietPlans.at(index);
    control.get('isDeleted')?.setValue(true);
    control.get('dietKey')?.disable();
    control.get('dietValue')?.disable();
    control.get('isEdit')?.setValue(false);
  }

  onCancel(index: number) {
    const control = this.dietPlans.at(index);
    const clone = control.get('cloneData')?.value;

    const dietKey = control.get('dietKey')?.value?.trim();
    const dietValue = control.get('dietValue')?.value?.trim();

    // If both fields are empty (before or after editing), remove the row
    const isNewRowEmpty = (!dietKey && !dietValue);

    if (isNewRowEmpty) {
      this.dietPlans.removeAt(index);
      return;
    }

    if (clone) {
      control.get('dietKey')?.setValue(clone.dietKey);
      control.get('dietValue')?.setValue(clone.dietValue);
    }

    control.get('isEdit')?.setValue(false);
    control.get('dietKey')?.disable();
    control.get('dietValue')?.disable();
  }



  onSave(index: number) {
    const control = this.dietPlans.at(index);

    const dietKey = control.get('dietKey');
    const dietValue = control.get('dietValue');

    // Mark fields as touched so that validation errors show
    dietKey?.markAsTouched();
    dietValue?.markAsTouched();

    // If form group is invalid, don't save
    if (control.invalid) {
      return;
    }

    control.get('isEdit')?.setValue(false);
    dietKey?.disable();
    dietValue?.disable();
  }

  validateAllFormFields(): boolean {
    let isValid = true;
    this.createDietPlanForm
    this.dietPlans.controls.forEach((control, index) => {
      const group = control as FormGroup;
      Object.keys(group.controls).forEach(controlName => {
        const formControl = group.get(controlName);
        if (formControl) {
          formControl.markAsTouched({ onlySelf: true });

          if (formControl.invalid) {
            isValid = false;
          }
        }
      });
    });

    return isValid;
  }
}
