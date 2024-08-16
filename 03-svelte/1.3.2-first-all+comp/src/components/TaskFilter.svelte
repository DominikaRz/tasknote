<script>
// @ts-nocheck

  import UIkit from 'uikit';
  import { tasks, categories } from '../stores/store';
  import { onMount, createEventDispatcher } from 'svelte';

  let searchQuery = '';
  let filterStatus = 'ALL';
  let filterCategory = 'ALL';

  const dispatch = createEventDispatcher();

  const statuses = [
        { status: 'TODO', tooltip: 'Undone', iconStyle: 'border: 1px #01a5f7 solid; color: transparent;' },
        { status: 'IN_PROGRESS', tooltip: 'In progress', iconStyle: 'border: 1px #01a5f7 solid;' },
        { status: 'DONE', tooltip: 'Done', iconStyle: 'border: 1px #01a5f7 solid; background-color: #01a5f7;' }
    ];

    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

    let categoriesList = [];
    $: categoriesList = $categories;

  
</script>

<div id="filtration">
  <div class="uk-margin">
    <form class="uk-search uk-search-default" >
      <span uk-search-icon></span>
      <input id="searchBar" class="uk-search-input" type="search" name="search" placeholder="Search" aria-label="Search" bind:value={searchQuery} />
    </form>
  </div>
  <div class="uk-grid-small uk-flex-middle uk-margin-large-right" uk-grid>
    <div class="uk-width-expand">
      <div class="uk-grid-small uk-grid-divider" uk-grid >
        <table class="uk-table uk-table-responsive" style="">
          <caption>Filtration</caption>
          <thead>
            <tr>
              <th class="uk-table-shrink"></th>
              <th class="uk-table-small">Status</th>
              <th class="uk-table-small">Priority</th>
              <th class="uk-table-expand">Category</th>
              <th class="uk-table-small">Due date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <ul class="uk-subnav uk-subnav-pill" uk-margin>
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <li uk-filter-control class="uk-active" ><a class="uk-badge">All</a></li>
                </ul>
              </td>
              <td class="divide">
                <ul class="uk-subnav uk-subnav-pill" uk-margin>
                  <li uk-filter-control="[data-done='TODO']"><a href="#"  style="padding: 5px;" uk-tooltip="Undone"> <!--class="uk-badge"-->
                    <span uk-icon="icon: check" style="border: 1px #01a5f7 solid; color: transparent;"></span></a></li>
                  <li uk-filter-control="[data-done='IN_PROGRESS']"><a href="#" style="padding: 5px;" uk-tooltip="In progress">
                    <span uk-icon="icon: check" style="border: 1px #01a5f7 solid;"></span></a></li>
                  <li uk-filter-control="[data-done='DONE']"><a href="#" style="padding: 5px;" uk-tooltip="Done">
                    <span uk-icon="icon: check" style="border: 1px #01a5f7 solid; background-color: #01a5f7;"></span></a></li>
                </ul>
              </td>
              <td class="divide">
                <ul class="uk-subnav uk-subnav-pill" uk-margin>
                        <li uk-filter-control={`[data-priority='LOW']`}>
                            <a href="#" class="dot-priority" style=" background-color: white; box-shadow: rgb(0, 0, 0) -7px 0px 5px -2px;" uk-tooltip='Low'></a>
                        </li>
                        <li uk-filter-control={`[data-priority='MEDIUM']`}>
                            <a href="#" class="dot-priority" style=" background-color: #dbdbdb; box-shadow: rgb(0, 0, 0) -7px 0px 7px -2px;" uk-tooltip='Medium'></a>
                        </li>
                        <li uk-filter-control={`[data-priority='HIGH']`}>
                            <a href="#" class="dot-priority" style="background-color: #a3a3a3; box-shadow: rgb(0, 0, 0) -7px 0px 7px -2px;" uk-tooltip='High'></a>
                        </li>
                        <li uk-filter-control={`[data-priority='URGENT']`}>
                            <a href="#" class="dot-priority" style="background-color: rgb(115, 115, 115);box-shadow: rgb(0, 0, 0) -7px 0px 7px -2px;" uk-tooltip='Urgent'></a>
                        </li>
                    
                </ul>
              </td>

              <td class="divide">
                <ul class="uk-subnav uk-subnav-pill" uk-margin>
                  {#each categoriesList  as category}
                        <li uk-filter-control={`[data-cat='${category.id}']`}>
                            <!-- svelte-ignore a11y-missing-content -->
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="#" class="uk-badge" style="background-color: {category.color} !important" uk-tooltip={category.name}></a>
                        </li>
                    {/each}
                </ul>
              </td>
              <td class="divide">
                <span class="uk-active" uk-filter-control="sort: data-due">
                  <a class="uk-icon-link" href="#" uk-icon="icon: arrow-down" aria-label="Sort ascending"></a>
                </span>
                <span uk-filter-control="sort: data-due; order: desc">
                  <a class="uk-icon-link" href="#" uk-icon="icon: arrow-up" aria-label="Sort descending"></a>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<style>
  .uk-search-default {
    width: 50vw !important;
  }
  .uk-search {
    margin: 4rem 10vw 1rem 10vw;
  }
  .uk-subnav-pill > * > :first-child {
    background: transparent;
    color: #1c1c1d !important;
    padding: 14px 15px;
  }
  .uk-subnav-pill > .uk-active > a {
    background-color: transparent;
    color: #1c1c1d !important;
    border: 1px #717182 solid;
  }
  .divide {
    border-left: 1px solid #e5e5e5;
    margin-left: 1rem;
  }
  .uk-table td {
    padding: 0px 12px;
  }
</style>
