import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthComponentApiService } from '../auth-component-api-service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AuthComponentApiService
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
  
      this.service.signin(authBody).subscribe({
        next: (res: any) => {
          this.isLoading = false; 
          if (res?.message === 'login success') {
            localStorage.setItem('USER-JWT-TOKEN', res?.jwt);
            this.router.navigate(['/home/welcome']);
          }
        },
        error: (err: any) => {
          this.isLoading = false; 
          console.error('Error during sign-in:', err);
        }
      });
    } else {
      Object.keys(this.signInForm.controls).forEach(key => {
        const control = this.signInForm.get(key);
        control?.markAsTouched();
      });
    }
  }
  

  signOut() {
    localStorage.removeItem('USER-JWT-TOKEN');
    this.router.navigate(['/auth/signin']);
  }
}