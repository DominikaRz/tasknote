import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, Attachment } from '../../models/task';
import { Category } from '../../models/category';
import { TaskService } from '../../services/task.service';
import { AttachmentModalComponent } from '../attachment-modal/attachment-modal.component';
import { SafePipe } from '../../pipe/safe.pipe';
import UIkit from 'uikit';
import { ImageCacheService } from '../../services/cache.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  standalone: true,
  imports: [CommonModule, AttachmentModalComponent, FormsModule, SafePipe]
})
export class TaskComponent implements OnInit, AfterViewInit {
  @Input() task!: Task;
  tasks: Task[] = [];
  categories: Category[] = [];
  isEditing = false;
  showDescription = false;
  percentage = 0;
  is_subtask = false;
  title = '';
  description = '';
  dueDate = '';
  id: number = 0;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'LOW';
  category = 0;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' = 'TODO';
  formattedEndDate = '';

  constructor(private taskService: TaskService, private imageCacheService: ImageCacheService) {
    this.taskService.tasks$.subscribe(tasks => this.tasks = tasks);
    this.taskService.categories$.subscribe(categories => this.categories = categories);
  }

  setId(number: number): void {
    this.id = number;
    console.log(this.id);
  }

  ngOnInit(): void {
    this.status = this.task.status;
    this.calculateProgress();
    this.formatEndDate();
    this.cacheTaskFiles();
  }

  cacheTaskFiles() {
    if (this.task && this.task.attachments) {
      this.task.attachments.forEach((attach: any) => {
          this.imageCacheService.cacheImage('/compress/' + attach.path);
      });
    }
  }

  ngAfterViewInit(): void {}

  getCategoryColor(catId: number): string {
    const category = this.categories.find(cat => cat.id === catId);
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
    const updatedTask: Task = {
      ...this.task,
      title: this.title,
      description: this.description,
      end_at: new Date(this.dueDate).toISOString(),
      priority: this.priority,
      category: this.category,
    };

    this.taskService.updateTask(updatedTask);
    Object.assign(this.task, updatedTask);
    this.isEditing = false;
  }

  toggleStatus(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.status = this.status === 'TODO' ? 'IN_PROGRESS' : this.status === 'IN_PROGRESS' ? 'DONE' : 'TODO';
    input.checked = this.status !== 'TODO';
    this.taskService.updateTask({ ...this.task, status: this.status });
  }

  removeTask(): void {
    this.taskService.deleteTask(this.task.id);
  }

  calculateProgress(): void {
    const count = this.task.subtasks.length;
    this.percentage = this.task.subtasks.reduce((acc, subtask) => {
      if (subtask.status === 'DONE') acc += 1;
      else if (subtask.status === 'IN_PROGRESS') acc += 0.1;
      else if(this.task.is_parent == false){
        if (this.task.status === 'DONE') acc = 1;
        else if (this.task.status === 'IN_PROGRESS') acc = 0.5;
      }
      return acc;
    }, 0);
    this.percentage = count > 0 ? (this.percentage * 100) / count : this.task.status === 'DONE' ? 100 : 0;
  }

  openSubtaskModal(): void {
    this.is_subtask = true;
    UIkit.modal('#add-task').show();
  }

  toggleDescription(): void {
    this.showDescription = !this.showDescription;
  }

  formatEndDate(): void {
    this.formattedEndDate = this.task.end_at ? new Date(this.task.end_at).toLocaleDateString() : 'No due date';
  }

  openConfirmationDialog(taskId: number): void {
    UIkit.modal.confirm('Are you sure you want to delete this task?').then(() => {
      this.removeTask();
    });
  }

  openLightbox(): void {
    const lightboxItems = this.generateLightboxItems(this.task.attachments);
    UIkit.lightboxPanel({ items: lightboxItems }).show(0);
  }

  generateLightboxItems(attachments: Attachment[]): any[] {
    return attachments.map(att => {
      if (att.type === 'IMAGE') return { source: `/compress/${att.path}`, caption: att.path, type: 'image' };
      if (att.type === 'FILE') return { source: `/compress/${att.path}`, caption: att.path, type: 'iframe' };
      if (att.type === 'VOICE') return { source: `/compress/${att.path}`, caption: att.path, type: 'video', attributes: { autoplay: false } };
      return null;
    }).filter(item => item !== null);
  }
}
