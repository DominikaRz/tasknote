import { Component, OnInit } from '@angular/core';
import UIkit from 'uikit';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-category-modal',
  templateUrl: './manage-category-modal.component.html',
  styleUrls: ['./manage-category-modal.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ManageCategoryModalComponent implements OnInit {
  newCategoryName = '';
  newCategoryColor = '#000000';
  selectedCategoryId: number | null = null;
  selectedCategoryName = '';
  selectedCategoryColor = '';
  categoriesList: any[] = [];

  constructor(private categoryService: CategoryService) {
    this.categoryService.categories$.subscribe(categories => {
      this.categoriesList = categories;
    });
  }

  ngOnInit(): void { }

  handleAddCategory(): void {
    const newCategory: Category = { id: 0, name: this.newCategoryName, color: this.newCategoryColor };
    this.categoryService.addCategory(newCategory);
    UIkit.modal('#manage-category').hide();
  }

  handleUpdateCategory(): void {
    if (this.selectedCategoryId !== null) {
      const updatedCategory: Category = { id: this.selectedCategoryId, name: this.selectedCategoryName, color: this.selectedCategoryColor };
      this.categoryService.updateCategory(updatedCategory);
      UIkit.modal('#manage-category').hide();
    }
  }

  onCategoryChange(event: any) {
    const selectedId = event.target.value;
    const selectedCategory = this.categoriesList.find(cat => cat.id === parseInt(selectedId));
    if (selectedCategory) {
      this.selectedCategoryName = selectedCategory.name;
      this.selectedCategoryColor = selectedCategory.color;
    }
  }

  deleteCategory(id: number): void {
    UIkit.modal.confirm('Are you sure you want to delete this category?').then(
      () => {
        this.categoryService.deleteCategory(id);
      },
      () => {
        console.log('Rejected.');
      }
    );
  }
}
