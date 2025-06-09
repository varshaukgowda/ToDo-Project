import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly STORAGE_KEY = 'task_categories';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private get storage(): Storage | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage;
    }
    return null;
  }

  getCategories(): string[] {
    if (this.storage) {
      const categories = this.storage.getItem(this.STORAGE_KEY);
      return categories ? JSON.parse(categories) : [];
    }
    return []; // Fallback for SSR
  }

  saveCategories(categories: string[]): void {
    if (this.storage) {
      this.storage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
    }
  }

  addCategory(category: string): string[] {
    const categories = this.getCategories();
    if (!categories.includes(category)) {
      categories.push(category);
      this.saveCategories(categories);
    }
    return categories;
  }

   deleteCategory(category: string): string[] {
    const categories = this.getCategories().filter(c => c !== category);
    this.saveCategories(categories);
    return categories;
  }
}