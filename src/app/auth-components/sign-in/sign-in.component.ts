import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthComponentApiService } from '../auth-component-api-service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ProgressSpinnerModule, ButtonModule, ToastModule],
  providers: [MessageService] // Add MessageService to providers
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AuthComponentApiService,
    private messageService: MessageService // Inject MessageService
  ) {
    this.signInForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    if (localStorage.getItem('USER-JWT-TOKEN')) {
      this.router.navigate(['/home/welcome']);
    }
  }

  onSignInSubmit() {
    if (this.signInForm.valid) {
      this.isLoading = true;
      const authBody = this.signInForm.value;
      this.service.signin(authBody).subscribe((res:any) => {
        const message = res?.Results?.message;
        this.isLoading = false;
        switch (message) {
          case 'login success':
            localStorage.setItem('USER-JWT-TOKEN', res?.Results?.jwt);
            localStorage.setItem('USER-INFO', JSON.stringify(res?.Results?.userInfo));
            if(res?.Results?.userInfo?.role != "3"){
              this.router.navigate(['/home/welcome']);
            } else if(res?.Results?.userInfo?.role == "3") {
              this.router.navigate(['/home/trainer/customers']);
            }
            break;
          case 'Invalid password':
          case 'User not found with given Email':
            this.showError(message);
            break;
          default:
            if (res?.ErrorMessage === 'Server error') {
              this.showError('Server error');
            }
            break;
        };
      });
    } else {
      Object.keys(this.signInForm.controls).forEach(key => {
        const control = this.signInForm.get(key);
        control?.markAsTouched();
      });
      this.showError('Please fill all required fields correctly');
    }
  }

  private showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000 // Show for 5 seconds
    });
  }

  signOut() {
    localStorage.removeItem('USER-JWT-TOKEN');
    this.router.navigate(['/auth/signin']);
  }
}
