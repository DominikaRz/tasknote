<script>
// @ts-nocheck

    import UIkit from 'uikit';
    import { categories } from '../stores/store';
    import { addCategory, updateCategory, deleteCategory } from '../stores/utils';
  
    let newCategoryName = '';
    let newCategoryColor = '#000000';
    let selectedCategoryId = '';
    let selectedCategoryName = '';
    let selectedCategoryColor = '';

    let id = 0;
  
    function handleAddCategory() {
      addCategory({ name: newCategoryName, color: newCategoryColor });
      UIkit.modal('#manage-category').hide();
    }
  
    function handleUpdateCategory() {
      updateCategory({ id: selectedCategoryId, name: selectedCategoryName, color: selectedCategoryColor });
      UIkit.modal('#manage-category').hide();
    }

    function setIdCat(number) {
        id = number;
        console.log(id);
    }

    function createCategoryState(index) {
      let isDisabled = true;
      let iconBackground = '#fff';

      function toggle() {
          // Toggle the state by updating local variables
          isDisabled = !isDisabled;
          iconBackground = isDisabled ? '#fff' : '#0066ff33';

          // Log current state after update
          console.log(`Toggle called for index ${index}: isDisabled = ${isDisabled}, iconBackground = ${iconBackground}`);

          // Update the global state object to trigger reactivity
          categoryStates[index] = {
              isDisabled: isDisabled,
              iconBackground: iconBackground
          };
          // Use assignment to ensure reactivity is triggered
          categoryStates = categoryStates.slice(); 
      }

      return {
          get isDisabled() { return isDisabled; },
          get iconBackground() { return iconBackground; },
          toggle
      };
  }

  //$: categoryStates = categories.map((cat, idx) => createCategoryState(idx));

  function deleteCat(index){
    setIdCat(index);
    UIkit.modal.confirm('Are you sure you want to delete this category?').then(function () {
            //console.log(idCat);
            deleteCategory(index);
            console.log('Confirmed.');
        }, function () {
            console.log('Rejected.');
        });
  }

  let categoriesList = [];
    $: categoriesList = $categories;
        



  </script>
  
<div id="manage-category" uk-modal>
  <div class="uk-modal-dialog">
    <button class="uk-modal-close-default" type="button" uk-close></button>
      <ul uk-tab>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <li><a href="#">Add</a></li>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <li><a href="#">Update</a></li>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <li><a href="#">Delete</a></li>
      </ul>
      <ul class="uk-switcher uk-margin">
          <li>
            <div class="uk-modal-header">
              <h2 class="uk-modal-title">Add new category</h2>
            </div>
            <form>
              <fieldset class="uk-fieldset">
                <div class="uk-modal-body">
                  <div class="uk-margin">
                    <label>Category name
                    <input id="addCatName" class="uk-input" type="text" placeholder="Category name" aria-label="Category name"></label>
                  </div>
                  <div class="uk-margin">
                    <label>Color of category: 
                    <input id="addCatColor" class="uk-input uk-margin-small-left" name="color" type="color" aria-label="Color"/></label>
                  </div>
                </div>
                <div class="uk-modal-footer uk-text-right">
                  <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                  <button class="uk-button uk-button-primary" type="button" on:click={handleAddCategory}>Save</button>
                </div>
              </fieldset>
            </form>
          </li>
          <li>
            <div class="uk-modal-header">
              <h2 class="uk-modal-title">Update category</h2>
            </div>
            <div class="uk-modal-body">
              <form class="uk-grid-small" >
                  <legend class="uk-legend">Edit Category</legend>
                  <div class="uk-margin">
                    <select id="chooseCategory" class="uk-select" name="category" bind:value={selectedCategoryId} on:change={e => {
                      const category = $categories.find(cat => cat.id == e.target.value);
                      selectedCategoryName = category.name;
                      selectedCategoryColor = category.color;
                    }}>
                      <option value="" disabled>Select Category</option>
                      {#each $categories as category}
                        <option value={category.id}>{category.name}</option>
                      {/each}
                    </select>
                  </div>
                  <div class="uk-margin">
                    <input id="updCatName" class="uk-input" type="text" name="category" placeholder="Category Name" bind:value={selectedCategoryName} />
                  </div>
                  <div class="uk-margin">
                    <input id="updCatColor" class="uk-input" name="color" type="color" bind:value={selectedCategoryColor} />
                  </div>
                  <button class="uk-button uk-button-primary" type="button" on:click={handleUpdateCategory}>Update Category</button>
                
              </form>
            </div>
          </li>
          <li>
            <div class="uk-modal-header">
              <h2 class="uk-modal-title">Delete category</h2>
            </div>
            <div class="uk-modal-body">
              <ul class="uk-list uk-margin">
                {#each categoriesList || [] as category}
                <li>
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <!-- svelte-ignore a11y-missing-content -->
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <a uk-icon="icon: trash; ratio: 1;" on:click|preventDefault={deleteCat(category.id)}  class="uk-icon-button dial-cat"></a> 
                  <span class="dot-category" style="background-color: {category.color}"></span> {category.name}
                </li>
                {/each}
              </ul>
            </div>
          </li>
      </ul>
  </div>
</div>

  