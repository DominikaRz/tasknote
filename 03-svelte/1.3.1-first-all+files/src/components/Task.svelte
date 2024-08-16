<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { categories } from '../stores/store';
    import AddTaskModal from './AddTaskModal.svelte';
    import { deleteTask, updateTask } from '../stores/utils';
    //import { EnhancedImg } from '@sveltejs/enhanced-img';
    import { fileCache } from '../lib/cacheService';
    
   import AttachmentModal from './AttachmentModal.svelte';

    import UIkit from 'uikit';
    import Icons from 'uikit/dist/js/uikit-icons';
    
    UIkit.use(Icons);


    export let task;

    const basePath = '/files/'; // Base path for images in the public directory
    const getImagePath = (filename) => `${basePath}${filename}`;

  //-------------SET ID----------------- 
    let id = 0;
    function setId(number){
        id = number;
        console.log(id);
    }

  //-------------GET CATEGORIES-----------------     
    let categoriesList = [];
    $: categoriesList = $categories;

  //-------------DATE FOR INPUT----------------- 
  
  // Convert the timestamp to a date string (YYYY-MM-DD)
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

    let formattedDate = formatDate(task.end_at);

  //-------------PRIORITY-----------------   
    let lowerPriority = task.priority.toLowerCase();


  //-------------EDITING----------------- 
    let isEditing = false;

    //function toggleEdit() {
    //  isEditing = !isEditing;
    //}

  let title = task.title;
  let description = task.description;
  let dueDate = task.end_at.split('T')[0];
  let priority = task.priority;
  let category = task.category;

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

    // Update the task object to reflect changes
    task.title = updatedTask.title;
    task.description = updatedTask.description;
    task.end_at = updatedTask.end_at;
    task.priority = updatedTask.priority;
    task.category = updatedTask.category;

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

  task.attachments = task.attachments || [];


  //-------------DELETION OF TASK-----------------  

  function removeTask() {
    deleteTask(id);
  }


  onMount(() => {

  //-------------DELETION OF TASK-----------------  
    UIkit.util.on(`#dialog${task.id}`, 'click', function (e) {
        e.preventDefault();
        e.target.blur();
        UIkit.modal.confirm('Are you sure you want to delete this task?').then(function () {
            console.log(id);
            removeTask();
            console.log('Confirmed.');
        }, function () {
            console.log('Rejected.');
        });
    });

  //-------------IMAGES-----------------
    UIkit.util.on('#js-animation-switcher', 'change', (e) => {
      UIkit.util.attr(UIkit.util('#js-lightbox-animation'), 'animation', e.target.value);
    });

  
  fileCache.loadFiles(task.attachments);
 
    // Function to generate the appropriate lightbox items
  function generateLightboxItems(attachments) {
    return attachments.map(att => {
      if (att.type === 'IMAGE') {
        return { source: $fileCache.cachedFiles[att.path] || `/files/${att.path}`, caption: att.path, type: 'image'};
      } else if (att.type === 'FILE') {
        return { source: `/files/${att.path}`, caption: att.path, type: 'iframe' };
      } else if (att.type === 'VOICE') {
        return { source: `/files/${att.path}`, caption: att.path, type: 'video', attributes: { autoplay: false } };
      }
    });
  }

  let lightboxItems = generateLightboxItems(task.attachments);

    UIkit.util.on(`.js-lightbox${task.id}`, 'click', (e) => {
      e.preventDefault();

      UIkit.lightboxPanel({
        items: lightboxItems
      }).show();
    });
  });

  //-------------DESCRIPTION-----------------
    let showDescription = false;

    function toggleDescription() {
        showDescription = !showDescription;
    }

  //-------------PROGRESS-----------------
    let count = task.subtasks.length;
    let percentage = 0;

    for(let i = 0; i < task.subtasks.length; i++){
        //console.log(task.subtasks[i].status);
        if(task.subtasks[i].status === "DONE") percentage = percentage + 1.0;
        if(task.subtasks[i].status === "IN_PROGRESS") percentage = percentage + 0.1;
    }
        if(count > 0) percentage = (percentage * 100) / count;
        else if(task.status=="DONE") percentage = 100;

    
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
    <article class="uk-comment uk-visible-toggle" tabindex="-1" role="comment" style="--border-color: {getColorById(task.category)};">  
      <div class="task uk-margin-large uk-card uk-card-default {task.priority.toLowerCase()}"> 
          <!--settings for the task-->
          <div class="settings uk-position-top-right uk-position-medium@l uk-hidden-hover">
            <div class="uk-inline uk-align-right">
              <button class="uk-button uk-button-text" type="button">
                <span  uk-icon="icon: cog"></span> Settings
              </button>
              <div uk-dropdown="mode: click">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-missing-attribute -->
                <ul class="uk-iconnav uk-iconnav-vertical">
                  <li><a on:click={setId(task.id)} href="#attach{task.id}" uk-toggle><span  uk-icon="icon: settings"></span> Attachements</a></li>
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <li><a class="uk-link-muted" on:click={toggleEdit}>
                    <span uk-icon="icon: pencil"></span> Edit task</a>
                  </li>
                  <!-- svelte-ignore a11y-invalid-attribute -->
                  <li><a id="dialog{task.id}" on:click={setId(task.id)} href="#"><span uk-icon="icon: trash"></span> Delete task</a></li>
                  <li>
                    <a class="uk-link-muted" on:click={openSubtaskModal}><span uk-icon="icon: plus"></span> Add Subtask</a>
                  </li>
              </ul>
              </div>
            </div>
          </div>   
          <div hidden={isEditing}>   
            <!--first row (checkbox, title, priority, progress, settings)-->
            <header class="uk-child-width-1-1 uk-child-width-1-2@m uk-child-width-1-2@l uk-child-width-1-2@xl" uk-grid>
              <div>
                  <div class="uk-child-width-1-2 uk-text-center" uk-grid>
                    <!--checkbox status-->
                      <div class="uk-width-auto">
                        <!--checkbox showing the status (unclicable if subtasks)-->
                        <input type="checkbox" name="status" checked={status !== 'TODO'} on:change={toggleStatus} />
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
                    <div>
                      <p>{percentage.toFixed(0)}% completed
                        <!--attachements-->
                        {#if task.attachments?.length > 0}<span id="js-lightbox{task.id}" class="uk-icon uk-icon-image js-lightbox{task.id}"  style="background-image: url(/img/paperclip.svg);"></span>{/if}
                      </p>
                         

                    </div>
                    <!--show/hide description-->
                    <div>
                     {#if task.description != null}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <span class="uk-button uk-button-text" style="margin: 0px !important;" on:click={toggleDescription}>
                          {showDescription ? 'Hide description' : 'Show description'}</span>
                      {/if}
                    </div>
                    <!--empty for settings in large screens-->
                    <div class="uk-hidden uk-visible@s"></div>
                  </div>
                  <div>
                    <!--due date-->
                    <div>
                      <h4 type="date" class="due-date uk-text-right uk-text-left@m uk-margin-medium-left@s">{new Date(task.end_at).toLocaleDateString()} </h4> <!--placeholder="" -->
                    </div>
                    <div>
                      <!--<button id="js-lightbox" class="uk-button uk-button-default">Attachements</button>-->
                    </div>
                    <!--slider?-->
                    <div class="uk-visible@m uk-visible@l uk-visible@xl js-lightbox{task.id}" uk-slider>
                      <div class="uk-position-relative uk-visible-toggle uk-light" tabindex="-1">
                          <div class="uk-slider-items uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-3@m">
                              {#each task.attachments as attach}
                                {#if attach.type == "IMAGE"}
                                <div>
                                  <div class="uk-cover-container" >
                                    <canvas></canvas>
                                    <img src={$fileCache.cachedFiles[attach.path] || `/files/${attach.path}`} alt={attach.path} 
                                    uk-cover/>
                                  </div>
                                </div>
                                {/if}
                                {#if attach.type == "FILE"}
                                  <div>
                                    <div class="uk-cover-container" >
                                      <canvas></canvas>
                                      <!-- svelte-ignore a11y-missing-attribute -->
                                      <iframe src={$fileCache.cachedFiles[attach.path] || `/files/${attach.path}`} alt={attach.path} uk-responsive  uk-cover
                                      uk-video="automute: true"></iframe>
                                    </div>
                                  </div>
                                {/if}
                                {#if attach.type == "VOICE"}
                                  <div>
                                    <div class="uk-cover-container" style="border: black 2px solid" >
                                      <canvas ></canvas>
                                      <!-- svelte-ignore a11y-media-has-caption -->
                                      <video src={$fileCache.cachedFiles[attach.path] || `/files/${attach.path}`} alt={attach.path} uk-responsive  uk-cover class="uk-position-center"
                                      uk-video="autoplay: false" poster="/img/play-button.svg" style="width: 2vw;"></video>
                                    </div>
                                  </div>
                                {/if}
                              {/each}
                          </div>
                          <a class="uk-position-center-left uk-position-small uk-hidden-hover" href uk-slidenav-previous uk-slider-item="previous"></a>
                          <a class="uk-position-center-right uk-position-small uk-hidden-hover" href uk-slidenav-next uk-slider-item="next"></a>
                      </div>
                      <ul class="uk-slider-nav uk-dotnav uk-flex-center uk-margin"></ul>
                    </div>
                  </div>
              </div>
              <script>
                
              </script>
              </div>
            </header>
            <!--second row (description)-->
            {#if task.description != null}
            <div class="description uk-child-width-1-1 uk-card-body uk-text-left uk-padding-medium uk-margin-small-bottom" uk-grid hidden={!showDescription}>
              <!--description of task-->
              <div class="descript">
                <p>{task.description}</p>
              </div>
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
          </div>
          <div hidden={!isEditing}>
            <form>
              <!--first row (checkbox, title, priority, progress, settings)-->
              <header class="uk-child-width-1-1 uk-child-width-1-2@m uk-child-width-1-2@l uk-child-width-1-2@xl" uk-grid>
                <div>
                    <div class="uk-child-width-1-2 uk-text-center" uk-grid>
                      <!--checkbox status-->
                        <div class="uk-width-auto">
                          <!--checkbox showing the status (unclicable if subtasks)-->
                          <input id="status{task.id}" type="checkbox" name="status" disabled checked/>
                        </div>
                      <!--title of task-->
                        <div class="uk-width-expand uk-text-left uk-margin-small-left">
                          <textarea id="title{task.id}" class="title uk-textarea" name="title" bind:value={title} rows="2" appAutosize 
                              ></textarea><!-- Now I can check if the adjust height is workin correctly-->
                            <!--<input type="text" class="title" placeholder="Task title but make it a bit longer for practice if it will work to be fully responsive. Even if it will not work, this text should show that" name="title" disabled/>-->
                          </div>
                    </div>
                </div>
                <div>
                  <div class="uk-child-width-1-2 uk-child-width-1-3@s uk-text-center" uk-grid>
                    <div>
                      <!--category-->
                      <div>
                        <div class="uk-margin">
                          <select id="priority{task.id}" class="uk-select" name="category" aria-label="Select" bind:value={category}>
                              {#each categoriesList  as category}
                                  <option value={category.id} selected={category.id == task.category}>{category.name}</option>
                              {/each}
                          </select>
                        </div>
                        <!--empty for settings in large screens-->
                        <div class="uk-hidden uk-visible@s"></div>
                      </div>
                    </div>
                    <div>
                      <!--due date-->
                      <div>
                        <input id="due_date{task.id}" type="date" name="due_date" class="due-date  uk-input" bind:value={dueDate}/>
                      </div>
                    </div>
                  </div>
                  <!--priority-->
                  <div>
                    <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                      <label><input id="priorityL{task.id}" class="uk-radio" type="radio" name="radio" value="LOW" bind:group={priority} checked={this.value == task.priority}>&nbsp;Low</label>
                      <label><input id="priorityM{task.id}" class="uk-radio" type="radio" name="radio" value="MEDIUM" bind:group={priority} checked={this.value == task.priority}>&nbsp;Medium</label>
                      <label><input id="priorityH{task.id}" class="uk-radio" type="radio" name="radio" value="HIGH" bind:group={priority} checked={this.value == task.priority}>&nbsp;High</label>
                      <label><input id="priorityU{task.id}" class="uk-radio" type="radio" name="radio" value="URGENT" bind:group={priority} checked={this.value == task.priority}>&nbsp;Urgent</label>
                    </div>
                  </div>
                </div>
              </header>
              <!--second row (description)-->
              <div id="descript" class="description uk-child-width-1-1 uk-card-body uk-text-left uk-padding-medium uk-margin-small-bottom" uk-grid>
                <!--description of task-->
                <div class="descript">
                  <textarea id="description{task.id}" class="descr uk-textarea" rows="3" name="description" appAutosize  bind:value={description}
                      ></textarea> 
                  </div>
              </div>
              <!--third row (dates, attachements, showing subtasks)-->
              <div class="third uk-text-center" uk-grid>
                <!--show subtasks button-->
                <div class="uk-width-1-6@m uk-width-1-2 uk-position-bottom-right uk-text-right uk-position-small">
                  <div class="uk-flex">
                    <button class="uk-button uk-button-default" type="button" on:click={toggleEdit}>Cancel</button>
                    <button class="uk-button uk-button-primary" type="button" on:click={saveTask}>Save</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </article>
      <AddTaskModal is_subtask={is_subtask} on:save={() => { is_subtask = false; }} />
      <AttachmentModal idTask={task.id} attachments={task.attachments}/> 

  
  <style>
    .task {
      padding: 2rem 0rem 5rem;
    }
    .descript{white-space: pre-line;}
    .description {
      text-wrap: wrap;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
      font-size: medium;
      color: #1c1c1d;
    }

    .image{ height: 2rem; width: 8vw;}

    .slide{
      padding: 0 !important;
      background-color: #1c1c1d;
    }
    .slider li img{ width: 100% !important; padding: 0 !important;}

    canvas{ height: 2vw; width: auto; }
    .uk-slider{ min-width: 100%; }

    h4{ margin: 0 !important}

  </style>
  