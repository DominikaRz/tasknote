import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { TaskComponent } from '../task/task.component';
import { TaskFilterComponent } from '../task-filter/task-filter.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [TaskComponent, CommonModule, TaskFilterComponent]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  searchQuery = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  applyFilters(searchQuery: string): void {
    this.searchQuery = searchQuery;
  }
}
