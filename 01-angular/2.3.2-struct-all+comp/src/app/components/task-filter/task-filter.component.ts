import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';

declare var UIkit: any;

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TaskFilterComponent implements OnInit {
  searchQuery = '';
  categories: any[] = [];
  statuses = [
    { value: 'TODO', label: 'Undone', style: { 'border': '1px #01a5f7 solid', 'color': 'transparent' } },
    { value: 'IN_PROGRESS', label: 'In progress', style: { 'border': '1px #01a5f7 solid' } },
    { value: 'DONE', label: 'Done', style: { 'border': '1px #01a5f7 solid', 'background-color': '#01a5f7' } }
  ];
  priorities = [
    { value: 'LOW', label: 'Low', style: { 'background-color' : 'white', 'box-shadow': 'rgb(0, 0, 0) -7px 0px 5px -2px' } },
    { value: 'MEDIUM', label: 'Medium', style: { 'background-color' : '#dbdbdb', 'box-shadow': 'rgb(0, 0, 0) -7px 0px 5px -2px'  } },
    { value: 'HIGH', label: 'High', style: { 'background-color' : '#a3a3a3', 'box-shadow': 'rgb(0, 0, 0) -7px 0px 5px -2px'  } },
    { value: 'URGENT', label: 'Urgent', style: { 'background-color' : 'rgb(115, 115, 115)', 'box-shadow': 'rgb(0, 0, 0) -7px 0px 5px -2px'  } }
  ];
  

  @Output() filterChanged = new EventEmitter<string>();

  constructor(private taskService: TaskService) {
    this.taskService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnInit(): void {}

  onSearchQueryChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.searchQuery = target.value;
      this.filterChanged.emit(this.searchQuery);
    }
  }

  sortOrder: string = 'asc';
  setSortOrder(order: string): void {
    this.sortOrder = order;
    this.filterChanged.emit(this.searchQuery); // Emit filter change event to trigger the UI update
  }
  
}
