import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements OnInit {
  loadingText = 'Preparing your financial dashboard...';

  constructor(private router: Router) {}

  ngOnInit() {
    this.startLoading();
  }

  private startLoading() {
    // Simple loading sequence
    setTimeout(() => {
      this.loadingText = 'Have an account? / Quick Calculator';
    }, 1000);

    setTimeout(() => {
      this.loadingText = 'Almost ready...';
    }, 3000);

    setTimeout(() => {
      this.loadingText = 'Welcome aboard!';
    }, 4500);

    // Redirect after 5 seconds
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }
}
