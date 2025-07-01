

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from "../sidenav/sidenav.component";
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/category/todo.service';
import { AddCategoryComponent } from "../add-category/add-category.component";
import { Router } from '@angular/router';

interface Task {
  id: number;
  name: string;
  completed: boolean;
  pinned: boolean;
  priority: 'High' | 'Medium' | 'Low' | 'None';
  createdAt: Date;
  scheduledAt?: Date;
  completedAt?: Date;
  updatedAt: Date;
  subtasks?: Subtask[];
  isAddingSubtask?: boolean;
  newSubtaskName?: string;
}

interface Subtask {
  id: number;
  name: string;
  completed: boolean;
  parentTaskId: number;
}

type CompletedItem = Task | Subtask;

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [CommonModule, SidenavComponent, FormsModule, AddCategoryComponent],
  templateUrl: './today.component.html',
  styleUrl: './today.component.scss',
})
export class TodayComponent implements OnInit {
  showCategoryModal = false;
  isMenuOpen = false;
  categories: string[] = []; 
  activeCategory: string | null = null;
  newTaskName = '';
  selectedDate: string = '';
  selectedTime: string = '';
  newTaskPriority: 'High' | 'Medium' | 'Low' | 'None' = 'None';
  minDate: string = '';
  
  categoryTasks: {[key: string]: Task[]} = {
    'Today': []
  };

  constructor(private todoservice: TodoService, private router: Router) { }

  ngOnInit(): void {
    this.setMinDate();
    this.checkTasksForToday();
    this.loadTasksFromLocalStorage();
    this.loadCategoriesFromLocalStorage();
  }

  private setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  private loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('categoryTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      
      for (const category in parsedTasks) {
        this.categoryTasks[category] = parsedTasks[category].map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          scheduledAt: task.scheduledAt ? new Date(task.scheduledAt) : undefined,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          subtasks: task.subtasks ? task.subtasks.map((subtask: any) => ({ 
            ...subtask,
            parentTaskId: task.id 
          })) : []
        }));
      }
    }
  }

  private loadCategoriesFromLocalStorage() {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      this.categories = JSON.parse(savedCategories);
    }
  }

  private saveTasksToLocalStorage() {
    localStorage.setItem('categoryTasks', JSON.stringify(this.categoryTasks));
  }

  private saveCategoriesToLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }

  showAddCategoryModal() {
    this.showCategoryModal = true;
  }

  hideAddCategoryModal() {
    this.showCategoryModal = false;
  }

  addCategory(categoryName: string) {
    if (categoryName.trim()) {
      this.categories = this.todoservice.addCategory(categoryName.trim());
      
      if (!this.categoryTasks[categoryName]) {
        this.categoryTasks[categoryName] = [];
      }
      
      this.saveCategoriesToLocalStorage();
      this.saveTasksToLocalStorage();
      this.hideAddCategoryModal();
      this.router.navigate(['/today']);
    }
  }

  openCategoryTasks(category: string) {
    this.activeCategory = category;
  }

  addTask() {
    if (this.newTaskName.trim()) {
      const category = 'Today'; 
      const now = new Date();
      
      let scheduledAt: Date | undefined;
      if (this.selectedDate) {
        let dateTimeString = this.selectedDate;
        if (this.selectedTime) {
          dateTimeString += `T${this.selectedTime}`;
        } else {
          dateTimeString += 'T23:59';
        }
        scheduledAt = new Date(dateTimeString);
      }

      if (!this.categoryTasks[category]) {
        this.categoryTasks[category] = [];
      }
      
      if (!this.categoryTasks[category].some(t => t.name === this.newTaskName.trim())) {
        this.categoryTasks[category].push({
          id: Date.now(),
          name: this.newTaskName.trim(),
          completed: false,
          pinned: false,
          priority: this.newTaskPriority,
          createdAt: now,
          scheduledAt: scheduledAt,
          updatedAt: now,
          subtasks: []
        });
        
        this.saveTasksToLocalStorage();
        this.newTaskName = '';
        this.selectedDate = '';
        this.selectedTime = '';
        this.newTaskPriority = 'None';
      } 
    }
  }

  isPastDue(date: Date): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  private checkTasksForToday(): void {
    console.log('Checking tasks for today...');
  }

  getTasksForCategory(category: string) {
    return this.categoryTasks[category] || [];
  }

  get activeTasks() {
    const category = this.activeCategory || 'Today';
    return this.getTasksForCategory(category)
      .filter(task => !task.completed)
      .sort((a, b) => {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2, 'None': 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        if (a.scheduledAt && !b.scheduledAt) return -1;
        if (!a.scheduledAt && b.scheduledAt) return 1;
        if (a.scheduledAt && b.scheduledAt) {
          return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
        }
        return 0;
      });
  }
  
  get completedTasks(): CompletedItem[] {
    const category = this.activeCategory || 'Today';
    const tasks = this.getTasksForCategory(category);

    const completedParents = tasks.filter(task => task.completed);

    const completedStandaloneSubtasks = tasks
      .filter(task => !task.completed && task.subtasks)
      .flatMap(task => 
        task.subtasks!.filter(subtask => subtask.completed)
      );

    return [...completedParents, ...completedStandaloneSubtasks].sort((a, b) => {
      const aDate = this.isTask(a) ? a.completedAt : this.getParentTask(a as Subtask)?.updatedAt;
      const bDate = this.isTask(b) ? b.completedAt : this.getParentTask(b as Subtask)?.updatedAt;
      return (bDate ? bDate.getTime() : 0) - (aDate ? aDate.getTime() : 0);
    });
  }

  isTask(item: CompletedItem): item is Task {
    return 'subtasks' in item;
  }

  getParentTask(subtask: Subtask): Task | undefined {
    const category = this.activeCategory || 'Today';
    const tasks = this.categoryTasks[category];
    return tasks.find(task => task.id === subtask.parentTaskId);
  }

  markAsDone(task: Task) {
    task.completed = true;
    task.completedAt = new Date();
    task.updatedAt = new Date();
    if (task.subtasks) {
      task.subtasks.forEach(subtask => subtask.completed = true);
    }
    this.saveTasksToLocalStorage();
  }

  markAsUndone(task: Task) {
    task.completed = false;
    task.completedAt = undefined;
    task.updatedAt = new Date();
    this.saveTasksToLocalStorage();
  }

  togglePin(task: Task) {
    task.pinned = !task.pinned;
    task.updatedAt = new Date();
    this.saveTasksToLocalStorage();
  }

  updateTaskPriority(task: Task, priority: 'High' | 'Medium' | 'Low' | 'None') {
    task.priority = priority;
    task.updatedAt = new Date();
    this.saveTasksToLocalStorage();
  }

  toggleAddSubtask(task: Task) {
    task.isAddingSubtask = !task.isAddingSubtask;
    task.newSubtaskName = '';
  }

  addSubtask(task: Task) {
    if (task.newSubtaskName?.trim()) {
      if (!task.subtasks) task.subtasks = [];
      task.subtasks.push({
        id: Date.now(),
        name: task.newSubtaskName.trim(),
        completed: false,
        parentTaskId: task.id
      });
      task.isAddingSubtask = false;
      task.newSubtaskName = '';
      task.updatedAt = new Date();
      this.saveTasksToLocalStorage();
    }
  }

  deleteSubtask(parentTask: Task, subtaskId: number) {
    if (parentTask.subtasks) {
      parentTask.subtasks = parentTask.subtasks.filter(t => t.id !== subtaskId);
      parentTask.updatedAt = new Date();
      this.saveTasksToLocalStorage();
    }
  }

  toggleSubtaskDone(subtask: Subtask) {
    subtask.completed = !subtask.completed;
    const parentTask = this.getParentTask(subtask);
    if (parentTask) {
      parentTask.updatedAt = new Date();
    }
    this.saveTasksToLocalStorage();
  }

  deleteSubtaskFromCompleted(item: CompletedItem) {
    const category = this.activeCategory || 'Today';
    
    if (this.isTask(item)) {
      this.categoryTasks[category] = this.categoryTasks[category].filter(t => t.id !== item.id);
    } else {
      const parentTask = this.categoryTasks[category].find(t => t.id === item.parentTaskId);
      if (parentTask?.subtasks) {
        parentTask.subtasks = parentTask.subtasks.filter(s => s.id !== item.id);
        parentTask.updatedAt = new Date();
      }
    }
    this.saveTasksToLocalStorage();
  }

  editTask(task: Task) {
    const newName = prompt('Edit task name:', task.name);
    if (newName !== null && newName.trim() !== '') {
      task.name = newName.trim();
      task.updatedAt = new Date();
      this.saveTasksToLocalStorage();
    }
  }

  deleteTask(task: Task) {
    const category = this.activeCategory || 'Today';
    this.categoryTasks[category] = this.categoryTasks[category].filter(t => t.id !== task.id);
    this.saveTasksToLocalStorage();
  }
  
  formatDate(date: Date): string {
    if (!date) return '';
    
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    
    let timeString = '';
    if (taskDate.getHours() !== 23 || taskDate.getMinutes() !== 59) {
      timeString = taskDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    
    if (taskDateOnly.getTime() === todayOnly.getTime()) {
      return timeString ? `Today, ${timeString}` : 'Today';
    } else if (taskDateOnly.getTime() === tomorrowOnly.getTime()) {
      return timeString ? `Tomorrow, ${timeString}` : 'Tomorrow';
    } else if (taskDate < today) {
      return timeString ? `Overdue (${taskDate.toLocaleDateString()} ${timeString})` : 'Overdue';
    } else {
      const dateString = taskDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: taskDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
      return timeString ? `${dateString}, ${timeString}` : dateString;
    }
  }
}