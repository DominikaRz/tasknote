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
  imports: [TaskComponent, CommonModule ,TaskFilterComponent]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filters: { searchQuery: string; filterStatus: string; filterCategory: string | number } = {
    searchQuery: '',
    filterStatus: 'ALL',
    filterCategory: 'ALL'
  };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  applyFilters(event: { searchQuery: string; filterStatus: string; filterCategory: string | number }): void {
    this.filters = event;
  }

  filterTasks(task: Task): boolean {
    const matchesSearchQuery = task.title.toLowerCase().includes(this.filters.searchQuery.toLowerCase());
    const matchesStatus = this.filters.filterStatus === 'ALL' || task.status === this.filters.filterStatus;
    const matchesCategory = this.filters.filterCategory === 'ALL' || task.category === this.filters.filterCategory;

    return matchesSearchQuery && matchesStatus && matchesCategory;
  }
}
