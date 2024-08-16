import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Task, TaskResponse } from '../models/task';
import { map } from 'rxjs/operators';
import { Category, CategoryResponse } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksUrl = '/assets/tasks.json'; // Path to tasks JSON file
  private categoriesUrl = '/assets/categories.json'; // Path to categories JSON file

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  tasks$ = this.tasksSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTasks();
    this.loadCategories();
  }

  loadTasks(): void { // Made public
    this.http.get<TaskResponse>(this.tasksUrl)
      .pipe(map(response => response.results))
      .subscribe(tasks => this.tasksSubject.next(tasks));
  
  }

  loadCategories(): void { // Made public
    //this.http.get<Category[]>(this.categoriesUrl).subscribe(categories => this.categoriesSubject.next(categories));
    this.http.get<CategoryResponse>(this.categoriesUrl).pipe(map(response => response.results))
    .subscribe(categories => this.categoriesSubject.next(categories));
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.tasksSubject.value;
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.tasksSubject.next([...tasks]);
    }
  }

  deleteTask(id: number): void {
    const tasks = this.tasksSubject.value.filter(task => task.id !== id);
    this.tasksSubject.next(tasks);
  }

  addTask(task: Task): void {
    const tasks = this.tasksSubject.value;
    task.id = tasks.length + 1; // Simulate ID generation
    this.tasksSubject.next([...tasks, task]);
  }
}
