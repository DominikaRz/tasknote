<script>
// @ts-nocheck
import { createEventDispatcher } from 'svelte';
import { categories, tasks } from '../stores/store';
import { addTask } from '../stores/utils';
import UIkit from 'uikit';
import debounce from 'lodash/debounce';

export let is_subtask = false;
let today = new Date();

let title = '';
let description = '';
let dueDate = today.toISOString().split('T')[0];
let priority = 'LOW';
let category = '';
let parent = null;

const dispatch = createEventDispatcher();

function handleAddTask() {
  const newTask = {
    title,
    description,
    end_at: dueDate,
    priority,
    category,
    attachments: [],
    subtasks: [],
    parent: is_subtask ? parent : null
  };

  addTask(newTask);
  UIkit.modal('#add-task').hide();
  dispatch('save');
}

const debouncedHandleAddTask = debounce(handleAddTask, 300);

  </script>
  
  <div id="add-task" uk-modal>
    <div class="uk-modal-dialog">
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title">Add New Task</h2>
      </div>
      <div class="uk-modal-body">
        <form>
          <div class="uk-margin">
            <input id="addTitle" class="uk-input" type="text" name="title" placeholder="Title" bind:value={title} />
          </div>
          <div class="uk-margin">
            <textarea id="addDescription" class="uk-textarea" rows="5" name="description" placeholder="Description" bind:value={description}></textarea>
          </div>
          <div class="uk-margin">
            <label for={dueDate}>Due date</label>
            <input id="addDue_date" class="uk-input" type="date" name="due_date" bind:value={dueDate} />
          </div>
          <div class="uk-margin">
            <label for={priority}>Priority</label>
            <select id="addPriority" class="uk-select" name="priority" bind:value={priority}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <div class="uk-margin">
            <label for={category}>Category</label>
            <select id="addCategory" class="uk-select" name="category" bind:value={category}>
              {#each $categories as category}
                <option value={category.id}>{category.name}</option>
              {/each}
            </select>
          </div>
          <div class="uk-margin">
            <label for={parent}>Is subtask of:</label>
            <select id="addParent" class="uk-select" name="parent" bind:value={parent}>
              <option value={null}>No Parent</option>
              {#each $tasks as task}
                <option value={task.id}>{task.title}</option>
              {/each}
            </select>
          </div>
        </form>
      </div>
      <div class="uk-modal-footer uk-text-right">
        <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
        <button class="uk-button uk-button-primary" type="button" on:click={debouncedHandleAddTask}>Add Task</button>
      </div>
    </div>
  </div>
  