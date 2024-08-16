import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, CategoryResponse } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesUrl = '/assets/categories.json'; // Path to categories JSON file

  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  loadCategories(): void { // Made public
    this.http.get<CategoryResponse>(this.categoriesUrl)
    .pipe(map(response => response.results))
    .subscribe(categories => this.categoriesSubject.next(categories));
  }

  addCategory(category: Category): void {
    const categories = this.categoriesSubject.value;
    category.id = categories.length + 1;
    this.categoriesSubject.next([...categories, category]);
  }

  updateCategory(updatedCategory: Category): void {
    const categories = this.categoriesSubject.value;
    const index = categories.findIndex(cat => cat.id === updatedCategory.id);
    if (index !== -1) {
      categories[index] = updatedCategory;
      this.categoriesSubject.next([...categories]);
    }
  }

  deleteCategory(id: number): void {
    const categories = this.categoriesSubject.value.filter(category => category.id !== id);
    this.categoriesSubject.next(categories);
  }
}
