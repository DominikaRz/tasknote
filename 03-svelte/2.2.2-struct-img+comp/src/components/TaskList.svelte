<script>
// @ts-nocheck

import Task from './Task.svelte';
import { tasks } from '../stores/store';

const getKey = (item) => item.id;

</script>

<div id="taskList">
    <ul class="uk-comment-list js-filter ">
      {#each $tasks as task (getKey(task))}
        <li data-cat={task.category} data-due={task.end_at} data-done={task.status} data-priority={task.priority}>
            <Task {task} />
            
            {#if task.is_parent && task.subtasks?.length > 0}
                <ul class="subtask{task.id}" hidden>
                    {#each task.subtasks as subtask (getKey(subtask))}
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
  