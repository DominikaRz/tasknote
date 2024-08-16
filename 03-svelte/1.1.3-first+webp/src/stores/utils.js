import { tasks, categories } from './store';

// Generate unique IDs for new tasks and categories
let taskId = 100;
let categoryId = 3;

// Task operations
export function addTask(newTask) {
  tasks.update(currentTasks => {
    newTask.id = taskId++;
    newTask.attachments = newTask.attachments || []; // Ensure attachments are initialized
    return [...currentTasks, newTask];
  });
}

export function updateTask(updatedTask) {
  tasks.update(currentTasks => {
    return currentTasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
  });
}

export function deleteTask(taskId) {
  tasks.update(currentTasks => currentTasks.filter(task => task.id !== taskId));
}

// Category operations
export function addCategory(newCategory) {
  categories.update(currentCategories => {
    newCategory.id = categoryId++;
    return [...currentCategories, newCategory];
  });
}

export function updateCategory(updatedCategory) {
  categories.update(currentCategories => {
    return currentCategories.map(category => (category.id === updatedCategory.id ? updatedCategory : category));
  });
}

export function deleteCategory(categoryId) {
  categories.update(currentCategories => currentCategories.filter(category => category.id !== categoryId));
}
