import { Component, OnInit } from '@angular/core';
import UIkit from 'uikit';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-category-modal',
  templateUrl: './manage-category-modal.component.html',
  styleUrls: ['./manage-category-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ManageCategoryModalComponent implements OnInit {
  newCategoryName = '';
  newCategoryColor = '#000000';
  selectedCategoryId: number | null = null;
  selectedCategoryName = '';
  selectedCategoryColor = '';
  categoriesList: Category[] = [];

  constructor(private categoryService: CategoryService) {
    this.categoryService.categories$.subscribe(categories => {
      this.categoriesList = categories;
    });
  }

  ngOnInit(): void {}

  handleAddCategory(): void {
    const newCategory: Category = { id: 0, name: this.newCategoryName, color: this.newCategoryColor };
    this.categoryService.addCategory(newCategory);
    UIkit.modal('#manage-category').hide();
    this.resetForm();
  }

  handleUpdateCategory(): void {
    if (this.selectedCategoryId !== null) {
      const updatedCategory: Category = { id: this.selectedCategoryId, name: this.selectedCategoryName, color: this.selectedCategoryColor };
      this.categoryService.updateCategory(updatedCategory);
      UIkit.modal('#manage-category').hide();
      this.resetForm();
    }
  }

  onCategoryChange(event: any): void {
    const selectedId = event.target.value;
    const selectedCategory = this.categoriesList.find(cat => cat.id === parseInt(selectedId, 10));
    if (selectedCategory) {
      this.selectedCategoryName = selectedCategory.name;
      this.selectedCategoryColor = selectedCategory.color;
    }
  }

  deleteCategory(id: number): void {
    UIkit.modal.confirm('Are you sure you want to delete this category?').then(() => {
      this.categoryService.deleteCategory(id);
    }, () => {
      console.log('Rejected.');
    });
  }

  private resetForm(): void {
    this.newCategoryName = '';
    this.newCategoryColor = '#000000';
    this.selectedCategoryId = null;
    this.selectedCategoryName = '';
    this.selectedCategoryColor = '';
  }
}
