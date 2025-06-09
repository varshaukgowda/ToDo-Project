import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from "../sidenav/sidenav.component";
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/services/todo.service';
import { AddCategoryComponent } from "../add-category/add-category.component";
import { Router } from '@angular/router';

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
  showTaskInput = false; 
  newTaskName = '';
  
  categoryTasks: {[key: string]: any[]} = {
    'Today': []
  };

  constructor(private todoservice: TodoService,private router:Router) { }

  ngOnInit(): void {
    this.checkTasksForToday();
    this.loadCategories();
   
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
      
      this.hideAddCategoryModal();
          this.router.navigate(['/today']);

    }
  }

  openCategoryTasks(category: string) {
    this.activeCategory = category;
    this.showTaskInput = true; 
  }


  addTask() {
  if (this.newTaskName.trim()) {
    const category = this.activeCategory || 'Today';
    
    if (!this.categoryTasks[category]) {
      this.categoryTasks[category] = [];
    }
    
    if (!this.categoryTasks[category].some(t => t.name === this.newTaskName.trim())) {
      this.categoryTasks[category].push({
        id: Date.now(),
        name: this.newTaskName.trim(),
        completed: false,
        pinned: false
      });
      
      this.newTaskName = '';
      this.hideTaskInput();
    } else {
      alert('This task already exists!');
    }
  }
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

  private loadCategories(): void {
    this.categories = this.todoservice.getCategories();
    this.categories.forEach(category => {
      if (!this.categoryTasks[category]) {
        this.categoryTasks[category] = [];
      }
    });
  }

  hideTaskInput() {
    this.showTaskInput = false;
    this.newTaskName = '';
  }

  getTasksForCategory(category: string) {
    return this.categoryTasks[category] || [];
  }

  get activeTasks() {
    const category = this.activeCategory || 'Today';
    return this.getTasksForCategory(category).filter(task => !task.completed);
  }
  
  get completedTasks() {
    const category = this.activeCategory || 'Today';
    return this.getTasksForCategory(category).filter(task => task.completed);
  }

  markAsDone(task: any) {
    task.completed = true;
  }

  markAsUndone(task: any) {
    task.completed = false;
  }

  togglePin(task: any) {
    task.pinned = !task.pinned;
  }

  editTask(task: any) {
    const newName = prompt('Edit task name:', task.name);
    if (newName !== null && newName.trim() !== '') {
      task.name = newName.trim();
    }
  }

  deleteTask(task: any) {
    const category = this.activeCategory || 'Today';
    this.categoryTasks[category] = this.categoryTasks[category].filter(t => t.id !== task.id);
  }
}


