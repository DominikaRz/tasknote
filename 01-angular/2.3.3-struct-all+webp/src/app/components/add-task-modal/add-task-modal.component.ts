import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { Category } from '../../models/category';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Observable } from 'rxjs';
import UIkit from 'uikit';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AddTaskModalComponent implements OnInit {
  @Input() is_subtask = false;
  @Output() taskAdded = new EventEmitter<Task>();

  title = '';
  description = '';
  dueDate = new Date().toISOString().substring(0, 10);
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'LOW';
  category = '';
  parent: number | null = null;
  categoriesList$: Observable<Category[]>;
  tasksList$: Observable<Task[]>;


  constructor(private taskService: TaskService, private categoryService: CategoryService) {
    this.categoriesList$ = this.categoryService.categories$;
    this.tasksList$ = this.taskService.tasks$;
  }

  ngOnInit(): void {}

  handleAddTask(): void {
    const newTask: Task = {
      id: 0,
      title: this.title,
      description: this.description,
      end_at: new Date(this.dueDate).toISOString(),
      priority: this.priority,
      category: parseInt(this.category, 10),
      attachments: [],
      subtasks: [],
      parent: this.is_subtask ? this.parent : null,
      status: 'TODO',
      created_at: new Date().toISOString(),
      is_parent: !this.is_subtask
    };

    this.taskService.addTask(newTask);
    UIkit.modal('#add-task').hide();
    this.taskAdded.emit(newTask);
    this.resetForm();
  }

  private resetForm(): void {
    this.title = '';
    this.description = '';
    this.dueDate = new Date().toISOString().substring(0, 10);;
    this.priority = 'LOW';
    this.category = '';
    this.parent = null;
  }
}
