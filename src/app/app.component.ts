import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodayComponent } from './components/today/today.component';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [TodayComponent],
  providers: [
    { provide: PLATFORM_ID, useValue: 'browser' }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'todo-app';
}
