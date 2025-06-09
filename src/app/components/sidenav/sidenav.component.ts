import { Component,EventEmitter,Input,Output} from '@angular/core';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { TodayComponent } from '../today/today.component';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/services/todo.service';
import { AddTaskComponent } from "../add-task/add-task.component";
import { Router } from '@angular/router';
import { TaskService } from '../../services/task/services.service';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, AddCategoryComponent,AddTaskComponent ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})

export class SidenavComponent {

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() categorySelected = new EventEmitter<string>();

  activeCategory: string | null = null;
  showModal = false;
  categories: string[] = [];
  // router: any;

  constructor(private todoService: TodoService,private taskService: TaskService,private router:Router) {}

  ngOnInit() {
  this.loadCategories();
  }

  loadCategories() {
    this.categories = this.todoService.getCategories();
    // console.log(this.categories);
  }


  showAddCategoryModal() {
    this.showModal = true;
    console.log('clicked');
  }

  hideAddCategoryModal() {
    this.showModal = false;
  }


   handleCategoryAdded(categoryName: string) {
    this.categories = this.todoService.addCategory(categoryName);
    this.hideAddCategoryModal();
     this.openCategory(categoryName);
  }

  editCategory(category:string){
    console.log('edit category',category);
  }

  // deleteCategory(category:string){
  //   console.log("delete category",category);
  //   // this.categories=this.categories.filter(c=> c!==category);
  //   if (confirm(`Delete "${category}" and all its tasks permanently?`)) {
  //     this.categories = this.todoService.deleteCategory(category);
  //   }
  // }

  deleteCategory(categoryName: string) {
  if (confirm(`Delete ${categoryName} and all its tasks?`)) {
    this.taskService.deleteCategory(categoryName);
    this.categories = this.taskService.getCategories();
  }

}

  openCategory(category: string) {
    this.activeCategory = category;
  }

  closeCategory() {
    this.activeCategory = null;
  }

  
  navigateToToday() {
    console.log('today');
    if (this.router.url !== '/today') {
    this.router.navigate(['/today']);
  }
  this.activeCategory = null;
   this.categorySelected.emit(); 
}




  onCategoryClick(category: string) {
  this.categorySelected.emit(category);
  this.activeCategory = category; 

}





}
