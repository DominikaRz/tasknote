<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { categories } from '../stores/store';
    import AddTaskModal from './AddTaskModal.svelte';
    import { deleteTask, updateTask } from '../stores/utils';
   import AttachmentModal from './AttachmentModal.svelte';

    import debounce from 'lodash/debounce'; // Import debounce from lodash

    import UIkit from 'uikit';
    import Icons from 'uikit/dist/js/uikit-icons';
    
    UIkit.use(Icons);

    export let task;

  //-------------GET CATEGORIES-----------------    
    $: categoriesList = $categories;

  //-------------EDITING----------------- 
    let isEditing = false;

  let title = '';
  let description = '';
  let dueDate = '';
  let priority = '';
  let category = 0;

  function toggleEdit() {
    isEditing = !isEditing;

    if (isEditing) {
      // Populate form fields with current task data
      title = task.title;
      description = task.description;
      dueDate = task.end_at.split('T')[0]; 
      priority = task.priority;
      category = task.category;
    }
  }

  function saveTask() {
    const updatedTask = {
      ...task,
      title,
      description,
      end_at: new Date(dueDate).toISOString(),
      priority,
      category
    };

    updateTask(updatedTask);
    Object.assign(task, updatedTask); // Use Object.assign to update the task object
    isEditing = false;
  }

  let status = task.status;

  function toggleStatus(event) {
    if (status === 'TODO') {
      status = 'IN_PROGRESS';
      event.target.checked = true;
    } else if (status === 'IN_PROGRESS') {
      status = 'DONE';
      event.target.checked = true;
    } else if (status === 'DONE') {
      status = 'TODO';
      event.target.checked = false;
    }

    const updatedTask = {
      ...task,
      status
    };

    updateTask(updatedTask);

    // Update the task object to reflect changes
    task.status = updatedTask.status;
  }

  const debouncedToggleStatus = debounce(toggleStatus, 300);

  //-------------IMAGES-----------------
    const basePath = '/webp/';
    const getPath = (filename) => `${basePath}${filename}`;

  onMount(() => {     
    
    /**/
    UIkit.util.on(`.js-lightbox${task.id}`, 'click', (e) => {
      e.preventDefault();

      UIkit.lightboxPanel({
        items: task.attachments.map(att => ({
          source: `/webp/${att.path_compress}`, ///srcMin/${att.path_compress_compress}
          caption: att.path_compress,
          type: att.type === 'IMAGE' ? 'image' : att.type === 'FILE' ? 'iframe' : 'video',
          attributes: att.type === 'VOICE' ? { autoplay: false } : {}
        }))
      }).show();
    });

  //-------------DELETION OF TASK-----------------  
    UIkit.util.on(`#dialog${task.id}`, 'click', function (e) {
      e.preventDefault();
      e.target.blur();
      UIkit.modal.confirm('Are you sure you want to delete this task?').then(function () {
        deleteTask(task.id);
      });
    });

  });  

 

  //-------------DESCRIPTION-----------------
    let showDescription = false;

    function toggleDescription() {
        showDescription = !showDescription;
    }

  //-------------PROGRESS-----------------
  $: percentage = calculateProgress(task);

  function calculateProgress(task) {
    if (task.subtasks.length === 0) {
      if (task.status === "DONE") return 100;
      if (task.status === "IN_PROGRESS") return 50;
      return 0;
    }

    return task.subtasks.filter(st => st.status === 'DONE').length / task.subtasks.length * 100;
  }

    //console.log(task.id+': '+percentage);

    
    let is_subtask = false;

    function openSubtaskModal() {
      is_subtask = true;
      UIkit.modal('#add-task').show();
    }

    function getColorById(id) {
      const category = categoriesList.find(cat => cat.id === id);
      return category ? category.color : null;
    }

</script>
  
    <!-- svelte-ignore a11y-unknown-role -->
    <article class="uk-comment uk-visible-toggle" style="--border-color: {getColorById(task.category)};">  
        <div class="task uk-padding-medium uk-padding-top-large uk-card uk-card-default {task.priority.toLowerCase()}"> 
          <!--settings for the task-->
          <div class="settings uk-position-top-right uk-position-medium@l uk-hidden-hover">
              <button class="uk-button uk-button-text" type="button">
                <span  uk-icon="icon: cog"></span> Settings
              </button>
              <div uk-dropdown="mode: click">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-missing-attribute -->
                <ul class="uk-iconnav uk-iconnav-vertical">
                  <li><a href="#attach{task.id}" uk-toggle>
                    <span  uk-icon="icon: settings"></span> Attachements</a>
                  </li>
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <li><a class="uk-link-muted" on:click={toggleEdit}>
                    <span uk-icon="icon: pencil"></span> Edit task</a>
                  </li>
                  <!-- svelte-ignore a11y-invalid-attribute -->
                  <li><a id="dialog{task.id}" href="#">
                    <span uk-icon="icon: trash"></span> Delete task</a>
                  </li>
                  <li>
                    <a class="uk-link-muted" on:click={openSubtaskModal}>
                      <span uk-icon="icon: plus"></span> Add Subtask</a>
                  </li>
                </ul>
              </div>
            </div>
          {#if !isEditing}   
          <!--<div hidden={isEditing}>   -->
            <!--first row (checkbox, title, priority, progress, settings)-->
            <header class="uk-child-width-1-1 uk-child-width-1-2@m uk-child-width-1-2@l uk-child-width-1-2@xl" uk-grid>
              <div>
                  <div class="uk-child-width-1-2 uk-text-center" uk-grid>
                    <!--checkbox status-->
                      <div class="uk-width-auto">
                        <!--checkbox showing the status (unclicable if subtasks)-->
                        <input type="checkbox" name="status" checked={status !== 'TODO'} on:change={debouncedToggleStatus}/>
                      </div>
                      <!--title of task-->
                      <div class="uk-width-expand uk-text-left uk-margin-small-left">
                        <h2 class="title uk-align-left" style={task.status == "DONE" ? "text-decoration: line-through" : "none"} name="title" disabled={!isEditing} class:done={status === 'DONE'}>
                          {task.title}
                        </h2>
                      </div>
                  </div>
              </div>
              <div>
                <div class="uk-child-width-1-2 uk-child-width-1-3@s uk-text-center" uk-grid>
                  <div>
                      <!--progress-->
                      <p>{percentage.toFixed(0)}% completed
                        <!--attachements-->
                        {#if task.attachments?.length > 0}<span id="js-lightbox{task.id}" class="uk-icon uk-icon-image js-lightbox{task.id}"  style="background-image: url(/img/paperclip.svg);"></span>{/if}
                      </p>
                    <!--show/hide description-->
                     {#if task.description != null}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <span class="uk-button uk-button-text" style="margin: 0px !important;" on:click={toggleDescription}>
                          {showDescription ? 'Hide description' : 'Show description'}</span>
                      {/if}
                    <!--empty for settings in large screens-->
                    <div class="uk-hidden uk-visible@s"></div>
                  </div>
                  <div>
                    <!--due date-->
                    <h4 type="date" class="due-date uk-text-right uk-text-left@m uk-margin-medium-left@s">{new Date(task.end_at).toLocaleDateString()} </h4> <!--placeholder="" -->
                    <!--path_compress-->
                    <!--slider?-->
                    <div id="slider{task.id}" uk-slider>
                      <div class="uk-position-relative uk-visible@m uk-visible@l uk-visible@xl js-lightbox{task.id}">
                        <div class="uk-slider-container uk-light">
                          <div class="uk-slider-items uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-3@m">
                            {#each task.attachments as attach}
                              {#if attach.type == "IMAGE"}
                                  <div class="uk-cover-container">
                                    <canvas width="80" height="40"></canvas>
                                    <img src={getPath(attach.path_compress)} alt={attach.path_compress} uk-cover />
                                  </div>
                              {/if}
                              
                              {#if attach.type == "FILE"}
                                  <div class="uk-cover-container">
                                    <canvas width="80" height="40"></canvas>
                                    <iframe src={getPath(attach.path_compress)} alt={attach.path_compress} uk-responsive uk-cover uk-video="automute: true"></iframe>
                                  </div>
                              {/if}
                              {#if attach.type == "VOICE"}
                                  <div class="uk-cover-container" style="border: black 2px solid">
                                    <canvas width="80" height="40"></canvas>
                                    <video src={getPath(attach.path_compress)} alt={attach.path_compress} uk-responsive uk-cover class="uk-position-center" uk-video="autoplay: false" poster="/img/play-button.svg" style="width: 2vw;"></video>
                                  </div>
                              {/if}
                            {/each}
                          </div>
                          <a class="uk-position-top-left-out uk-position-small uk-overlay uk-hidden-hover" href uk-slidenav-previous uk-slider-item="previous"></a>
                          <a class="uk-position-top-right-out uk-position-small uk-overlay uk-hidden-hover" href uk-slidenav-next uk-slider-item="next"></a>
                        </div>
                        <ul class="uk-slider-nav uk-dotnav uk-flex-center uk-margin"></ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <!--second row (description)-->
            {#if task.description != null}
            <div class="description uk-child-width-1-1 uk-card-body uk-text-left uk-padding-medium uk-margin-small-bottom" uk-grid hidden={!showDescription}>
              <p>{task.description}</p>
            </div>
            {/if}
            <!--third row (dates, attachements, showing subtasks)-->
            <div class="third uk-text-center" uk-grid>
              <!--show subtasks button-->
              <div class="uk-width-1-6@m uk-width-1-2 uk-position-bottom-right uk-text-right uk-position-small">
                <!-- svelte-ignore a11y-invalid-attribute -->
                {#if task.is_parent}<a href="" class="uk-button uk-button-text uk-link-muted" uk-toggle="target: .subtask{task.id}">Show subtasks</a>{/if}
              </div>
            </div>
          {:else}
            <form>
              <!--first row (checkbox, title, priority, progress, settings)-->
              <header class="uk-child-width-1-1 uk-child-width-1-2@m uk-child-width-1-2@l uk-child-width-1-2@xl" uk-grid>
                <div>
                      <!--title of task-->
                        <div class="uk-width-large uk-text-left uk-margin-small-left">
                          <textarea id="title{task.id}" class="title uk-textarea" name="title" bind:value={title} rows="2" appAutosize 
                              ></textarea><!-- Now I can check if the adjust height is workin correctly-->
                            <!--<input type="text" class="title" placeholder="Task title but make it a bit longer for practice if it will work to be fully responsive. Even if it will not work, this text should show that" name="title" disabled/>-->
                          </div>
                </div>
                <div>
                  <div class="uk-child-width-1-2 uk-text-center" uk-grid>
                    
                      <!--category-->
                      <select id="category{task.id}" class="uk-select uk-width-medium" name="category" aria-label="Select" bind:value={category}>
                          {#each categoriesList  as category}
                              <option value={category.id} selected={category.id == task.category}>{category.name}</option>
                          {/each}
                      </select>
                        <!--due date-->
                      <div class="uk-padding-small-left">
                          <input id="due_date{task.id}" type="date" name="due_date" class="due-date  uk-input" bind:value={dueDate}/>
                      </div>
                  </div>
                    <!--priority-->
                    <div class="priority uk-margin uk-margin-small-left uk-grid-small uk-width-exand uk-grid">
                      <label><i>Priority:</i></label>
                      <label>
                        <input id="priorityL{task.id}" class="uk-radio uk-margin-small-left" type="radio" 
                        name="radio" value="LOW" bind:group={priority} checked={this.value == task.priority}>
                        Low
                      </label>
                      <label>
                        <input id="priorityM{task.id}" class="uk-radio uk-margin-small-left" type="radio" 
                        name="radio" value="MEDIUM" bind:group={priority} checked={this.value == task.priority}>
                        Medium
                      </label>
                      <label>
                        <input id="priorityH{task.id}" class="uk-radio uk-margin-small-left" type="radio" 
                        name="radio" value="HIGH" bind:group={priority} checked={this.value == task.priority}>
                        High
                      </label>
                      <label>
                        <input id="priorityU{task.id}" class="uk-radio uk-margin-small-left" type="radio" 
                        name="radio" value="URGENT" bind:group={priority} checked={this.value == task.priority}>
                        Urgent
                      </label>
                    </div>
                </div>
              </header>
              <!--second row (description)-->
              <div id="descript" class="description uk-child-width-1-1 uk-card-body uk-text-left uk-padding-medium uk-margin-large-bottom" uk-grid>
                <!--description of task-->
                <label>Description:
                <textarea id="description{task.id}" class="descr uk-textarea" rows="3" name="description" appAutosize  bind:value={description}
                ></textarea> </label>
              </div>
              <!--third row (dates, attachements, showing subtasks)-->
              <div class="third uk-text-center" uk-grid>
                <!--show buttons-->
                <div class="uk-flex uk-width-1-6@m uk-width-1-2 uk-position-bottom-right uk-text-right uk-position-small">
                    <button class="uk-button uk-button-default" type="button" on:click={toggleEdit}>Cancel</button>
                    <button class="uk-button uk-button-primary" type="button" on:click={saveTask}>Save</button>
                </div>
              </div>
            </form>
          {/if}
        </div>
      </article>
      <AddTaskModal is_subtask={is_subtask} on:save={() => { is_subtask = false; }} />
      <AttachmentModal idTask={task.id} attachments={task.attachments}/><!---->

  
  <style>
    .uk-slider-items {
      contain: layout paint;
    }
    
  </style>