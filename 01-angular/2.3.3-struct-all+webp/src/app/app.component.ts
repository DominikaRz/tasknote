import { Component, OnInit } from '@angular/core';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

UIkit.use(Icons);

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from './components/navbar/navbar.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddTaskModalComponent } from './components/add-task-modal/add-task-modal.component';
import { ManageCategoryModalComponent } from './components/manage-category-modal/manage-category-modal.component';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    TaskListComponent,
    AddTaskModalComponent,
    ManageCategoryModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  constructor(private taskService: TaskService) { }
}

