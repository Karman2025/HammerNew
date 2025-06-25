import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;

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
      // if (this.customerFieldData.profileImage) {
        this.profileImage = this.customerFieldData.profileImage;
      // }
      this.loadCustomerFormData();
    }
  }
  get customerData(): any {
    return this.customerFieldData;
  }

  formMode:"view" | "edit" | "create" = "view";
  createCustomerForm!: FormGroup;
  customerFieldData: any;
  profileImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  // Webcam variables
  showWebcamDialog = false;
  isWebcamReady = false;
  capturedImage: string | null = null;
  mediaStream: MediaStream | null = null;

  defaultValues = {
    ctr_Name: '',
    ctr_Code: '',
    ctr_Email: '',
    ctr_MobileNo: '',
    ctr_Addresses: '',
    ctr_Dob: '',
    ctr_WhatsAppNo: '',
    // ctr_Height: '',
    ctr_Weight: '',
    ctr_CustomPaymentPlanStartDate: null,
    ctr_CustomPaymentPlanEndDate: null,
    branch: null,
    branchId: null,
    profileImage: null
  };

  paymentPlanOptions:any[] = paymentPlanOptions;
  loggedInUser:any;

  constructor(
    private fb: FormBuilder,
  ) {
    this.inItFormControl();

    if(this.createCustomerForm){
      this.createCustomerForm.valueChanges.subscribe(updatedData => {
        if(updatedData && this.customerFieldData){
          Object.assign(this.customerFieldData, updatedData);
        }
      });
    }
  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('USER-INFO') ?? "{}");
    if (this.loggedInUser?.role == '2') {
      this.createCustomerForm.patchValue({ branchId: this.loggedInUser._id });
      this.createCustomerForm.get('branchId')?.disable();
    } else if(this.loggedInUser?.role == '3'){
        this.createCustomerForm.patchValue({ branchId: this.loggedInUser.branchId });
        this.createCustomerForm.get('branchId')?.disable();
        this.createCustomerForm.get('ctr_Addresses')?.clearValidators();
        this.createCustomerForm.get('ctr_Dob')?.clearValidators();
        this.createCustomerForm.get('ctr_Email')?.clearValidators();
        this.createCustomerForm.get('ctr_WhatsAppNo')?.clearValidators();
        this.createCustomerForm.get('ctr_Weight')?.clearValidators();
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
      // ctr_Height: new FormControl('', Validators.required),
      ctr_Weight: new FormControl('', Validators.required),
      ctr_CustomPaymentPlanStartDate: new FormControl(''),
      ctr_CustomPaymentPlanEndDate: new FormControl(''),
      branchId: new FormControl(null, Validators.required),
      profileImage: new FormControl(null)
    });
  }

  // File upload handler
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.updateProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // Webcam dialog handlers
  async openWebcamDialog() {
    this.showWebcamDialog = true;
    this.capturedImage = null;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 500 },
          height: { ideal: 500 },
          facingMode: 'user'
        },
        audio: false
      });

      this.videoElement.nativeElement.srcObject = this.mediaStream;
      this.isWebcamReady = true;
    } catch (err) {
      console.error('Error accessing webcam:', err);
      this.isWebcamReady = false;
    }
  }

  closeWebcamDialog() {
    this.stopWebcam();
    this.showWebcamDialog = false;
    this.capturedImage = null;
  }

  stopWebcam() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.videoElement?.nativeElement?.srcObject) {
      this.videoElement.nativeElement.srcObject = null;
    }
    this.isWebcamReady = false;
  }

  captureImage() {
    if (!this.isWebcamReady) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.capturedImage = canvas.toDataURL('image/png');
  }

  retryCapture() {
    this.capturedImage = null;
  }

  useCapturedImage() {
    if (this.capturedImage) {
      this.updateProfileImage(this.capturedImage);
      const blob = this.dataURItoBlob(this.capturedImage);
      this.selectedFile = new File([blob], 'webcam-capture.png', { type: 'image/png' });
      this.closeWebcamDialog();
    }
  }


  private updateProfileImage(imageData: string) {
    this.profileImage = imageData;
    this.createCustomerForm.patchValue({
      profileImage: imageData
    });
    if (this.customerFieldData) {
      this.customerFieldData.profileImage = imageData;
    }
  }


  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  loadCustomerFormData() {
    if(this.formMode === 'view' || this.formMode ==='edit') {
      if(this.customerFieldData) {
        // console.log(this.customerFieldData);

        this.createCustomerForm.patchValue(this.customerFieldData);
      }
    } else if(this.formMode ==='create'){
      this.createCustomerForm.reset(this.defaultValues);
    }
  }

  onFormClear() {
    this.createCustomerForm.reset(this.defaultValues);
    this.profileImage = null;
    this.selectedFile = null;
  }

  isCreateCustomerFormValid(){
    if (this.createCustomerForm.valid) {
      return true;
    } else {
      this.createCustomerForm.markAllAsTouched();
      return false;
    }
  }

  getProfileImageFile(): File | null {
    return this.selectedFile;
  }
}
