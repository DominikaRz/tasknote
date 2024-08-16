import { useState } from 'react';

// Generate unique IDs for new tasks and categories
let taskId = 100;
let categoryId = 3;

// Custom hook for task management
export function useTaskManager(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = (newTask) => {
    newTask.id = taskId++;
    newTask.attachments = newTask.attachments || []; // Ensure attachments are initialized
    setTasks((currentTasks) => [...currentTasks, newTask]);
  };

  const updateTask = (updatedTask) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (taskId) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  };
}


// Custom hook for category management
export function useCategoryManager(initialCategories = []) {
  const [categories, setCategories] = useState(initialCategories);

  const addCategory = (newCategory) => {
    newCategory.id = categoryId++;
    setCategories((currentCategories) => {
      const newCategories = [...currentCategories, newCategory];
      console.log('Categories after addition:', newCategories);  // Log state after addition
      return newCategories;
    });
  };

  const updateCategory = (updatedCategory) => {
    setCategories((currentCategories) => {
      const newCategories = currentCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      );
      console.log('Categories after update:', newCategories);  // Log state after update
      return newCategories;
    });
  };

  const deleteCategory = (categoryId) => {
    setCategories((currentCategories) => {
      const newCategories = currentCategories.filter((category) => category.id !== categoryId);
      console.log('Categories after deletion:', newCategories);  // Log state after deletion
      return newCategories;
    });
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}