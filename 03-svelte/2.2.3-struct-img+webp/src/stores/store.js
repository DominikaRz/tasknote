import { writable } from 'svelte/store';
import tasksData from './tasks.json';
import categoriesData from './categories.json';

export const tasks = writable(tasksData.results);
export const categories = writable(categoriesData.results);
