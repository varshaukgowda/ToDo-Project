import { Routes } from '@angular/router';
import { TodayComponent } from './components/today/today.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

export const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
    { path: 'today', component: TodayComponent },
    { path: '', redirectTo: '/today', pathMatch: 'full' }
];