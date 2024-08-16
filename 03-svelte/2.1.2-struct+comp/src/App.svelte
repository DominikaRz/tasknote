<script>
// @ts-nocheck
import Navbar from './components/Navbar.svelte';
import TaskFilter from './components/TaskFilter.svelte';
import TaskList from './components/TaskList.svelte';

import "uikit/dist/css/uikit.min.css"

let AddTaskModal;
let ManageCategoryModal;
let showAddTaskModal = false;
let showManageCategoryModal = false;

function loadAddTaskModal() {
  if (!AddTaskModal) {
    import('./components/AddTaskModal.svelte').then((module) => {
      AddTaskModal = module.default;
      showAddTaskModal = true;
    });
  } else {
    showAddTaskModal = true;
  }
}

function loadManageCategoryModal() {
  if (!ManageCategoryModal) {
    import('./components/ManageCategoryModal.svelte').then((module) => {
      ManageCategoryModal = module.default;
      showManageCategoryModal = true;
    });
  } else {
    showManageCategoryModal = true;
  }
}
</script>

<main class="main">
  <Navbar on:manage-category={loadManageCategoryModal} on:add-task={loadAddTaskModal} />
  <div uk-filter="target: .js-filter">
    <TaskFilter />
    <TaskList />
    {#if showAddTaskModal && AddTaskModal}
      <svelte:component this={AddTaskModal} on:close={() => (showAddTaskModal = false)} />
    {/if}
    {#if showManageCategoryModal && ManageCategoryModal}
      <svelte:component this={ManageCategoryModal} on:close={() => (showManageCategoryModal = false)} />
    {/if}
  </div>
</main>