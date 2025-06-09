import { Component,EventEmitter,Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule,CommonModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})

export class AddCategoryComponent {
@Output() categoryAdded = new EventEmitter<string>();
@Output() closeModalEvent = new EventEmitter<void>();
  
  categoryName = '';
  isVisible = false;

  show() {
    this.isVisible = true;
    this.categoryName = ''; 

  }

  closeModal() {
    this.isVisible = false;
    this.closeModalEvent.emit();
    console.log('cancel clicked');
  }

  addCategory() {
     console.log('add clicked');
    if (this.categoryName.trim()) {
      this.categoryAdded.emit(this.categoryName.trim());
      this.categoryName = '';
      this.closeModal();
     
    }
  }

  
}
