import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Category } from '../../models/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TaskFilterComponent implements OnInit {
  searchQuery = '';
  filterStatus = 'ALL';
  filterPriority = 'ALL';
  filterCategory: string | number = 'ALL';
  
  categories: any[] = [];
  categoriesList: Category[] = [];
  statuses = [
    { status: 'TODO', tooltip: 'Undone', iconStyle: 'border: 1px #01a5f7 solid; color: transparent;' },
    { status: 'IN_PROGRESS', tooltip: 'In progress', iconStyle: 'border: 1px #01a5f7 solid;' },
    { status: 'DONE', tooltip: 'Done', iconStyle: 'border: 1px #01a5f7 solid; background-color: #01a5f7;' }
  ];
  priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  @Output() searchQueryChanged = new EventEmitter<{ searchQuery: string; filterStatus: string; filterCategory: string | number }>();
  @Output() filterChanged = new EventEmitter<{ searchQuery: string; filterStatus: string; filterCategory: string | number }>();

  constructor(private taskService: TaskService) {
    this.taskService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }
  

  ngOnInit(): void {}

  onSearchQueryChange(): void {
    this.emitFilterChange();
  }

  onFilterChange(): void {
    this.emitFilterChange();
  }

  emitFilterChange(): void {
    this.filterChanged.emit({
      searchQuery: this.searchQuery,
      filterStatus: this.filterStatus,
      filterCategory: this.filterCategory
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'LOW': return 'white';
      case 'MEDIUM': return '#dbdbdb';
      case 'HIGH': return '#a3a3a3';
      case 'URGENT': return 'rgb(115, 115, 115)';
      default: return 'white';
    }
  }
}
