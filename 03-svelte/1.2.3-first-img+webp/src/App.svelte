<script>
// @ts-nocheck

  import Navbar from './components/Navbar.svelte';
  import TaskFilter from './components/TaskFilter.svelte';
  import TaskList from './components/TaskList.svelte';
  import AddTaskModal from './components/AddTaskModal.svelte';
  import ManageCategoryModal from './components/ManageCategoryModal.svelte';

  import { tasks, categories } from './stores/store';

  import UIkit from 'uikit';
    import Icons from 'uikit/dist/js/uikit-icons';
    UIkit.use(Icons);
</script>


<main class="main">
  <Navbar />
  <div uk-filter="target: .js-filter">
    <!--<TaskFilter />-->
    <TaskList />
    <AddTaskModal />
    <ManageCategoryModal />
    
  </div>
</main>

<style>
  /* Add any additional styles here */
</style>
