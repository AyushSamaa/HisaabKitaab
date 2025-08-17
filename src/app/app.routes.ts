import { Routes } from '@angular/router';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
import { QuickHisabKitabComponent } from './components/quick-hisabkitab/quick-hisabkitab.component';

export const routes: Routes = [
  { path: '', redirectTo: '/getting-started', pathMatch: 'full' },
  { path: 'getting-started', component: GettingStartedComponent },
  { path: 'quick-hisabkitab', component: QuickHisabKitabComponent }
];
