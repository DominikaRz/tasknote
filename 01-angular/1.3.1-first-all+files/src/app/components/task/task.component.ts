import { Component, Input, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, Attachment } from '../../models/task';
import { Category } from '../../models/category';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { AttachmentModalComponent } from '../attachment-modal/attachment-modal.component';
import { SafePipe } from '../../pipe/safe.pipe';
import { ImageCacheService } from '../../services/cache.service';

import * as UIkit from 'uikit';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  standalone: true,
  imports: [CommonModule, AttachmentModalComponent, FormsModule, SafePipe],
  
})
export class TaskComponent implements OnInit, AfterViewInit {
  @Input() task!: Task;
  tasks: any[] = [];
  categories: any[] = [];
  categoriesList: Category[] = [];
  id = 0;
  isEditing = false;
  showDescription = false;
  percentage = 0;
  is_subtask = false;
  title = '';
  description = '';
  dueDate = '';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'LOW';
  category = 0;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' = 'TODO';
  formattedEndDate: string = '';

  constructor(private taskService: TaskService, private imageCacheService: ImageCacheService) {
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
    /**/
    this.taskService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  

  ngOnInit(): void {
    this.categoriesList = this.getCategories();
    this.status = this.task.status;
    this.calculateProgress();
    this.formatEndDate();
    this.cacheTaskFiles();
  }

  cacheTaskFiles() {
    if (this.task && this.task.attachments) {
      this.task.attachments.forEach((attach: any) => {
          this.imageCacheService.cacheImage('/files/' + attach.path);
      });
    }
  }

  ngAfterViewInit(): void {}

  setId(number: number): void {
    this.id = number;
    console.log(this.id);
  }

  getCategories(): Category[] {
    // Fetch categories from your service or store
    return [];
  }

  getCategoryColor(catId: any): string {
    const category = this.categories.find(cat => cat.id === parseInt(catId));
    return category ? category.color : '#fff';
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.title = this.task.title;
      this.description = this.task.description;
      this.dueDate = this.task.end_at.split('T')[0];
      this.priority = this.task.priority;
      this.category = this.task.category;
    }
  }

  saveTask(): void {
    const updatedTask = {
      ...this.task,
      title: this.title,
      description: this.description,
      end_at: new Date(this.dueDate).toISOString(),
      priority: this.priority,
      category: this.category
    };

    this.taskService.updateTask(updatedTask);

    this.task.title = updatedTask.title;
    this.task.description = updatedTask.description;
    this.task.end_at = updatedTask.end_at;
    this.task.priority = updatedTask.priority;
    this.task.category = updatedTask.category;
    this.getCategoryColor(this.category);

    this.isEditing = false;
  }

  toggleStatus(event: Event): void {
    if (this.status === 'TODO') {
      this.status = 'IN_PROGRESS';
      (event.target as HTMLInputElement).checked = true;
    } else if (this.status === 'IN_PROGRESS') {
      this.status = 'DONE';
      (event.target as HTMLInputElement).checked = true;
    } else if (this.status === 'DONE') {
      this.status = 'TODO';
      (event.target as HTMLInputElement).checked = false;
    }

    const updatedTask = {
      ...this.task,
      status: this.status
    };

    this.taskService.updateTask(updatedTask);

    this.task.status = updatedTask.status;
  }

  removeTask(): void {
    this.taskService.deleteTask(this.id);
  }

  calculateProgress(): void {
    const count = this.task.subtasks.length;
    this.percentage = 0;

    for (let i = 0; i < this.task.subtasks.length; i++) {
      if (this.task.subtasks[i].status === 'DONE') this.percentage += 1.0;
      if (this.task.subtasks[i].status === 'IN_PROGRESS') this.percentage += 0.1;
    }
    if (count > 0) this.percentage = (this.percentage * 100) / count;
    else if (this.task.status === 'DONE') this.percentage = 100;
  }

  openSubtaskModal(): void {
    this.is_subtask = true;
    //@ts-ignore
    UIkit.modal('#add-task').show();
  }

  toggleDescription(): void {
    this.showDescription = !this.showDescription;
  }

  formatEndDate(): void {
    this.formattedEndDate = this.task.end_at ? new Date(this.task.end_at).toLocaleDateString() : 'No due date';
  }

  
  openConfirmationDialog(taskId: number): void {
    // UIkit modal confirmation
    //@ts-ignore
    UIkit.modal.confirm('Are you sure you want to delete this task?').then(() => {
      this.setId(taskId);
      this.removeTask();
      console.log('Confirmed.');
    }, () => {
      console.log('Rejected.');
    });
  }

  openLightbox(){
    const lightboxItems = this.generateLightboxItems(this.task.attachments);
    //@ts-ignore
    UIkit.lightboxPanel({
      items: lightboxItems
    }).show(0);
  }

  generateLightboxItems(attachments: Attachment[]): any[] {
    return attachments.map((att: Attachment) => {
      if (att.type === 'IMAGE') {
        return { source: `/files/${att.path}`, caption: att.path, type: 'image' };
      } else if (att.type === 'FILE') {
        return { source: `/files/${att.path}`, caption: att.path, type: 'iframe' };
      } else if (att.type === 'VOICE') {
        return { source: `/files/${att.path}`, caption: att.path, type: 'video' };
      }
      return null;
    }).filter(item => item !== null);
  }
}
