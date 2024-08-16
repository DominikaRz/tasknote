<script>
    import Task from './Task.svelte';
    import { tasks } from '../stores/store';
    import TaskFilter from './TaskFilter.svelte';

let filters = {
  searchQuery: '',
  filterStatus: 'ALL',
  filterCategory: 'ALL'
};

function applyFilters(event) {
  filters = event.detail;
}

function filterTasks(task) {
  const matchesSearchQuery = task.title.toLowerCase().includes(filters.searchQuery.toLowerCase());
  const matchesStatus = filters.filterStatus === 'ALL' || task.status === filters.filterStatus;
  const matchesCategory = filters.filterCategory === 'ALL' || task.category === filters.filterCategory;

  return matchesSearchQuery && matchesStatus && matchesCategory;
}
</script>

<TaskFilter/>
  <div id="taskList">
    <ul class="uk-comment-list js-filter">
      {#each $tasks as task}
        <li data-cat={task.category} data-due={task.end_at} data-done={task.status} data-priority={task.priority}>
            <Task {task} />
            
            {#if task.is_parent && task.subtasks?.length > 0}
                <ul class="subtask{task.id}" hidden>
                    {#each task.subtasks as subtask}
                        <li>
                        <Task task={subtask} />
                        </li>
                    {/each}
                </ul>
            {/if}
        </li>
      {/each}
    </ul>
  </div>
  
  <style>
    #taskList {
      width: 92vw;
    }
  </style>
  