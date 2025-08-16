import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };
  isLoading = false;
  showPassword = false;

  constructor(private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onQuickStart() {
    // Navigate to quick calculator/dashboard without authentication
    console.log('Quick start clicked - navigating to calculator');
    // You can navigate to a quick calculator route here
    // this.router.navigate(['/quick-calculator']);
  }

  onSubmit() {
    if (this.loginData.email && this.loginData.password) {
      this.isLoading = true;
      
      // Simulate login process
      setTimeout(() => {
        this.isLoading = false;
        // Here you would typically handle actual authentication
        console.log('Login attempt:', this.loginData);
        // Navigate to dashboard or show success message
      }, 2000);
    }
  }

  onForgotPassword() {
    // Handle forgot password functionality
    console.log('Forgot password clicked');
  }

  onSignUp() {
    // Navigate to signup page
    console.log('Sign up clicked');
  }
}
