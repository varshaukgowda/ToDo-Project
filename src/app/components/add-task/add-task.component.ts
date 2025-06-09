// import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { TaskService } from '../../services/task/services.service';

// interface Task {
//   id: string;
//   name: string;
//   done: boolean;
//   pinned: boolean;
//   category: string;
//   createdAt: Date;
// }

// @Component({
//   selector: 'app-add-task',
//   imports: [FormsModule, CommonModule],
//   standalone: true,
//   templateUrl: './add-task.component.html',
//   styleUrl: './add-task.component.scss'
// })

// export class AddTaskComponent implements OnInit {
//   @Input() categoryName: string = '';
//   @Input() isActive: boolean = false;
//   @Output() closeCategory = new EventEmitter<void>();

//   newTaskName: string = '';
//   tasks: Task[] = [];
//   isLoading: boolean = false;

//   constructor(private taskService: TaskService) {}

//   ngOnInit() {
//     this.tasks = []; 
//     this.loadTasks();
    
    
//   }

//   private generateTaskId(): string {
//     return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//   }


//   private loadTasks() {
//   // Clear current tasks before loading
//   this.tasks = [];
//   // Load only tasks for this category
//   const loadedTasks = this.taskService.getTasks(this.categoryName);
//   this.tasks = loadedTasks.filter(task => task.category === this.categoryName);
//   // console.log(this.tasks)
  
//   }

//   private saveTasks() {
//   // Create a clean copy with only tasks for this category
//   const tasksToSave = this.tasks.filter(task => task.category === this.categoryName);
//   this.taskService.saveTasks(this.categoryName, tasksToSave);
// }


//   get activeTasks(): Task[] {
//   return this.tasks
//     .filter(task => !task.done && task.category === this.categoryName)
//     .sort((a, b) => (a.pinned === b.pinned) ? 0 : a.pinned ? -1 : 1);
// }

//   get completedTasks(): Task[] {
//   return this.tasks
//     .filter(task => task.done && task.category === this.categoryName);
// }

//   addTask() {
//     if (this.newTaskName.trim()) {
//       this.tasks.push({
//         id: this.generateTaskId(),
//         name: this.newTaskName.trim(),
//         done: false,
//         pinned: false,
//         category: this.categoryName,
//         createdAt: new Date()
//       });
//       // this.newTaskName = '';
//       this.saveTasks();

//     }
    
//   }

//   toggleTaskDone(task: Task) {
//     this.tasks = this.tasks.map(t => 
//       t.id === task.id ? {...t, done: !t.done} : t
//     );
//     this.saveTasks();
//   }

//   pinTask(task: Task) {
//     this.tasks = this.tasks.map(t => 
//       t.id === task.id ? {...t, pinned: !t.pinned} : t
//     );
//     this.saveTasks();
//   }

//   deleteTask(task: Task) {
//     this.tasks = this.tasks.filter(t => t.id !== task.id);
//     this.saveTasks();
//   }

//   openEditDialog(task: Task) {
//     const newName = prompt('Edit task:', task.name);
//     if (newName !== null && newName.trim()) {
//       this.tasks = this.tasks.map(t => 
//         t.id === task.id ? {...t, name: newName.trim()} : t
//       );
//       this.saveTasks();
//     }
//   }

//   close() {
//     this.closeCategory.emit();
//   }
// }

// *********************************
// import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { TaskService } from '../../services/task/services.service';



// interface Task {
//   id: string;
//   name: string;
//   done: boolean;
//   pinned: boolean;
//   category: string;
//   createdAt: Date;
//   dueDate?: Date;
// }

// @Component({
//   selector: 'app-add-task',
//   imports: [FormsModule, CommonModule],
//   standalone: true,
//   templateUrl: './add-task.component.html',
//   styleUrl: './add-task.component.scss'
// })
// export class AddTaskComponent implements OnInit, OnChanges {
//   @Input() categoryName: string = '';
//   @Input() isActive: boolean = false;
//   @Output() closeCategory = new EventEmitter<void>();

//   newTaskName: string = '';
//   tasks: Task[] = [];
//   isLoading: boolean = false;
  


//   constructor(private taskService: TaskService) {}

//   ngOnInit() {
//     this.loadTasks();
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['categoryName'] && !changes['categoryName'].firstChange) {
//       this.loadTasks();
//     }
//   }

//   private generateTaskId(): string {
//     return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//   }

//   private loadTasks() {
//     this.isLoading = true;
//     this.tasks = [];
    
//     setTimeout(() => {
//       const loadedTasks = this.taskService.getTasks(this.categoryName);
//       this.tasks = loadedTasks.filter(task => task.category === this.categoryName);
//       this.isLoading = false;
//     }, 100);
//   }

//   private saveTasks() {
//     const tasksToSave = this.tasks.filter(task => task.category === this.categoryName);
//     this.taskService.saveTasks(this.categoryName, tasksToSave);
//   }

//   get activeTasks(): Task[] {
//     return this.tasks
//       .filter(task => !task.done && task.category === this.categoryName)
//       .sort((a, b) => (a.pinned === b.pinned) ? 0 : a.pinned ? -1 : 1);
//   }

//   get completedTasks(): Task[] {
//     return this.tasks.filter(task => task.done && task.category === this.categoryName);
//   }

//   addTask() {
//     if (this.newTaskName.trim()) {
//       this.tasks.push({
//         id: this.generateTaskId(),
//         name: this.newTaskName.trim(),
//         done: false,
//         pinned: false,
//         category: this.categoryName,
//         createdAt: new Date()
//       });
//       this.newTaskName = '';
//       this.saveTasks();
//     }
//   }

//   toggleTaskDone(task: Task) {
//     this.tasks = this.tasks.map(t => 
//       t.id === task.id ? {...t, done: !t.done} : t
//     );
//     this.saveTasks();
//   }

//   pinTask(task: Task) {
//     this.tasks = this.tasks.map(t => 
//       t.id === task.id ? {...t, pinned: !t.pinned} : t
//     );
//     this.saveTasks();
//   }

//   deleteTask(task: Task) {
//     this.tasks = this.tasks.filter(t => t.id !== task.id);
//     this.saveTasks();
//   }

//   openEditDialog(task: Task) {
//     const newName = prompt('Edit task:', task.name);
//     if (newName !== null && newName.trim()) {
//       this.tasks = this.tasks.map(t => 
//         t.id === task.id ? {...t, name: newName.trim()} : t
//       );
//       this.saveTasks();
//     }
//   }

//   close() {
//     this.closeCategory.emit();
//   }

//   // Call this when navigating away from the component
//   clearTasks() {
//     this.tasks = [];
//   this.newTaskName = '';
//   }
// }

// *******

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task/services.service';

interface Task {
  id: string;
  name: string;
  done: boolean;
  pinned: boolean;
  category: string;
  createdAt: Date;
  dueDate?: Date;
}

@Component({
  selector: 'app-add-task',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit, OnChanges {
  @Input() categoryName: string = '';
  @Input() isActive: boolean = false;
  @Output() closeCategory = new EventEmitter<void>();

  newTaskName: string = '';
  selectedDate: string = '';
  tasks: Task[] = [];
  isLoading: boolean = false;
  todayDate: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.setTodayDate();
    this.loadTasks();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryName'] && !changes['categoryName'].firstChange) {
      this.loadTasks();
    }
  }

  private setTodayDate() {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
  }

  private generateTaskId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  private loadTasks() {
    this.isLoading = true;
    this.tasks = [];
    
    setTimeout(() => {
      const loadedTasks = this.taskService.getTasks(this.categoryName);
      this.tasks = loadedTasks.filter(task => task.category === this.categoryName);
      this.isLoading = false;
    }, 100);
  }

  private saveTasks() {
    const tasksToSave = this.tasks.filter(task => task.category === this.categoryName);
    this.taskService.saveTasks(this.categoryName, tasksToSave);
  }

  get activeTasks(): Task[] {
    return this.tasks
      .filter(task => !task.done && task.category === this.categoryName)
      .sort((a, b) => {
        // First sort by pinned status
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        // Then sort by due date (tasks with due dates first, then by date)
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return 0;
      });
  }

  get completedTasks(): Task[] {
    return this.tasks.filter(task => task.done && task.category === this.categoryName);
  }

  addTask() {
    if (this.newTaskName.trim()) {
      const newTask: Task = {
        id: this.generateTaskId(),
        name: this.newTaskName.trim(),
        done: false,
        pinned: false,
        category: this.categoryName,
        createdAt: new Date()
      };

      // Add due date if selected
      if (this.selectedDate) {
        newTask.dueDate = new Date(this.selectedDate);
      }

      this.tasks.push(newTask);
      this.newTaskName = '';
      this.selectedDate = '';
      this.saveTasks();
    }
  }

  toggleTaskDone(task: Task) {
    this.tasks = this.tasks.map(t => 
      t.id === task.id ? {...t, done: !t.done} : t
    );
    this.saveTasks();
  }

  pinTask(task: Task) {
    this.tasks = this.tasks.map(t => 
      t.id === task.id ? {...t, pinned: !t.pinned} : t
    );
    this.saveTasks();
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
  }

  openEditDialog(task: Task) {
    const newName = prompt('Edit task:', task.name);
    if (newName !== null && newName.trim()) {
      this.tasks = this.tasks.map(t => 
        t.id === task.id ? {...t, name: newName.trim()} : t
      );
      this.saveTasks();
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Reset time to compare only dates
    const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    
    if (taskDateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (taskDateOnly.getTime() === tomorrowOnly.getTime()) {
      return 'Tomorrow';
    } else if (taskDate < today) {
      return 'Overdue';
    } else {
      return taskDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: taskDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  close() {
    this.closeCategory.emit();
  }

  // Call this when navigating away from the component
  clearTasks() {
    this.tasks = [];
    this.newTaskName = '';
    this.selectedDate = '';
  }
}



// import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { TaskService } from '../../services/task/services.service';

// interface Task {
//   id: string;
//   name: string;
//   done: boolean;
//   pinned: boolean;
//   category: string;
//   createdAt: Date;
//   dueDate?: Date;
// }

// @Component({
//   selector: 'app-add-task',
//   imports: [FormsModule, CommonModule],
//   standalone: true,
//   templateUrl: './add-task.component.html',
//   styleUrl: './add-task.component.scss'
// })
// export class AddTaskComponent implements OnInit, OnChanges {
//   @Input() categoryName: string = '';
//   @Input() isActive: boolean = false;
//   @Output() closeCategory = new EventEmitter<void>();

//   newTaskName: string = '';
//   selectedDateTime: string = '';
//   tasks: Task[] = [];
//   isLoading: boolean = false;
//   todayDateTime: string = '';

//   constructor(private taskService: TaskService) {}

//   ngOnInit() {
//     this.setTodayDateTime();
//     this.loadTasks();
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['categoryName'] && !changes['categoryName'].firstChange) {
//       this.loadTasks();
//     }
//   }

//   private setTodayDateTime() {
//     const now = new Date();
//     // Set to current date and time for datetime-local input
//     this.todayDateTime = now.toISOString().slice(0, 16);
//   }

//   private generateTaskId(): string {
//     return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//   }

//   private loadTasks() {
//     this.isLoading = true;
//     this.tasks = [];
    
//     setTimeout(() => {
//       const loadedTasks = this.taskService.getTasks(this.categoryName);
//       this.tasks = loadedTasks.filter(task => task.category === this.categoryName);
//       this.isLoading = false;
//     }, 100);
//   }

//   private saveTasks() {
//     const tasksToSave = this.tasks.filter(task => task.category === this.categoryName);
//     this.taskService.saveTasks(this.categoryName, tasksToSave);
//   }

//   get activeTasks(): Task[] {
//     return this.tasks
//       .filter(task => !task.done && task.category === this.categoryName)
//       .sort((a, b) => {
//         // First sort by pinned status
//         if (a.pinned !== b.pinned) {
//           return a.pinned ? -1 : 1;
//         }
//         // Then sort by due date (tasks with due dates first, then by date)
//         if (a.dueDate && !b.dueDate) return -1;
//         if (!a.dueDate && b.dueDate) return 1;
//         if (a.dueDate && b.dueDate) {
//           return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
//         }
//         return 0;
//       });
//   }

//   get completedTasks(): Task[] {
//     return this.tasks.filter(task => task.done && task.category === this.categoryName);
//   }

//   addTask() {
//     if (this.newTaskName.trim()) {
//       const newTask: Task = {
//         id: this.generateTaskId(),
//         name: this.newTaskName.trim(),
//         done: false,
//         pinned: false,
//         category: this.categoryName,
//         createdAt: new Date()
//       };

//       // Add due date if selected
//       if (this.selectedDateTime) {
//         newTask.dueDate = new Date(this.selectedDateTime);
//       }

//       this.tasks.push(newTask);
//       this.newTaskName = '';
//       this.selectedDateTime = '';
//       this.saveTasks();
//     }
//   }

//   toggleTaskDone(task: Task) {
//     this.tasks = this.tasks.map(t => 
//       t.id === task.id ? {...t, done: !t.done} : t
//     );
//     this.saveTasks();
//   }

//   pinTask(task: Task) {
//     this.tasks = this.tasks.map(t => 
//       t.id === task.id ? {...t, pinned: !t.pinned} : t
//     );
//     this.saveTasks();
//   }

//   deleteTask(task: Task) {
//     this.tasks = this.tasks.filter(t => t.id !== task.id);
//     this.saveTasks();
//   }

//   openEditDialog(task: Task) {
//     const newName = prompt('Edit task:', task.name);
//     if (newName !== null && newName.trim()) {
//       this.tasks = this.tasks.map(t => 
//         t.id === task.id ? {...t, name: newName.trim()} : t
//       );
//       this.saveTasks();
//     }
//   }

//   formatDate(date: Date | undefined): string {
//     if (!date) return '';
    
//     const taskDate = new Date(date);
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     // Reset time to compare only dates
//     const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
    
//     if (taskDateOnly.getTime() === today.getTime()) {
//       // If it's today, show the time as well
//       return `Today ${taskDate.toLocaleTimeString('en-US', { 
//         hour: 'numeric', 
//         minute: '2-digit',
//         hour12: true 
//       })}`;
//     } else if (taskDateOnly.getTime() === tomorrow.getTime()) {
//       // If it's tomorrow, show the time as well
//       return `Tomorrow ${taskDate.toLocaleTimeString('en-US', { 
//         hour: 'numeric', 
//         minute: '2-digit',
//         hour12: true 
//       })}`;
//     } else if (taskDate < now) {
//       return 'Overdue';
//     } else {
//       // For other dates, show date and time
//       return taskDate.toLocaleDateString('en-US', { 
//         month: 'short', 
//         day: 'numeric',
//         year: taskDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
//       }) + ' ' + taskDate.toLocaleTimeString('en-US', { 
//         hour: 'numeric', 
//         minute: '2-digit',
//         hour12: true 
//       });
//     }
//   }

//   close() {
//     this.closeCategory.emit();
//   }

//   // Call this when navigating away from the component
//   clearTasks() {
//     this.tasks = [];
//     this.newTaskName = '';
//     this.selectedDateTime = '';
//   }
// }

