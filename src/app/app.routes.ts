import { Routes } from '@angular/router';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/getting-started', pathMatch: 'full' },
  { path: 'getting-started', component: GettingStartedComponent },
  { path: 'login', component: LoginComponent }
];
