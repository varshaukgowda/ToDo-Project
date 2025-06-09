import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
   tasks = [
    { name: 'Use lists to manage tasks', completed: false },
    { name: 'Completed 1', completed: true },
    { name: 'Click the input box to create a task', completed: false },
    { name: 'Feature Modules 3', completed: false, bold: true },
    { name: 'Eisenhower Matrix: Prioritize tasks', completed: false },
    { name: 'Calendar: Check your schedule', completed: false },
    { name: 'Habit: Visualize your efforts', completed: false },
    // { name: 'Completed 1', completed: true },
    // { name: 'Pomodoro: Rescue from procrastination', completed: false },
    // { name: 'Explore More 5', completed: false, bold: true },
    // { name: 'Kanban, Timeline View: Visual management', completed: false },
    // { name: 'Subscription Calendar: Never miss events', completed: false },
    // { name: 'More unique features', completed: false },
    // { name: 'Premium', completed: false },
    // { name: 'Follow Us', completed: false }
  ];

   toggleTask(task: any) {
    task.completed = !task.completed;
  }


}
