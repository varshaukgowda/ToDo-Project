
import { Injectable } from '@angular/core';

interface Task {
  id: string;
  name: string;
  done: boolean;
  pinned: boolean;
  category: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_PREFIX = 'tasks_';
    private readonly CATEGORIES_KEY = 'task_categories';
  getTodayTaskCount: any;
  getInboxTaskCount: any;

  getTasks(categoryName: string): Task[] {
    const savedTasks = localStorage.getItem(this.getStorageKey(categoryName));
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    
    return tasks.filter((task: Task) => task.category === categoryName);
  }

  saveTasks(categoryName: string, tasks: Task[]): void {
    const categoryTasks = tasks.filter(task => task.category === categoryName);
    localStorage.setItem(
      this.getStorageKey(categoryName),
      JSON.stringify(categoryTasks)
    );
  }

   getCategories(): string[] {
    return JSON.parse(localStorage.getItem(this.CATEGORIES_KEY) || '[]');
  }

  saveCategories(categories: string[]): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
  }


  deleteCategory(categoryName: string): void {
    const categories = this.getCategories();
    const updatedCategories = categories.filter(cat => cat !== categoryName);
    this.saveCategories(updatedCategories);

    localStorage.removeItem(this.getStorageKey(categoryName));
  }

  
  private getStorageKey(categoryName: string): string {
    return `${this.STORAGE_PREFIX}${categoryName}`;
  }

}