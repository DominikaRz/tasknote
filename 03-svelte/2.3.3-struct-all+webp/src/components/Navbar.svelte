<script>
// @ts-nocheck

    let logo = "/assets/logo.svg";


    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function handleAddTask() {
      dispatch('add-task');
    }

    function handleManageCategory(event) {
      dispatch('manage-category');
      setTimeout(() => {
        event.target.closest('a').removeAttribute('hidden');
      }, 1);
    }
  </script>

<!--for small devices-->
<div id="navbar" class="uk-hidden@xl uk-hidden@l uk-hidden@m uk-hidden@s uk-position-bottom">
  <div uk-sticky="start: 170; position: bottom; animation: uk-animation-slide-bottom; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent uk-dark; end: !html; offset: 0">
    <nav class="uk-navbar-container">
      <div class="uk-container">
        <div uk-navbar>
          <a href="#filtration" class="uk-navbar-item uk-logo" uk-scroll>
            <!--<img src="{logo}" alt="logo" width="40" height="40" />-->
            <img src={logo} alt="logo" width="40" height="40" />
          </a>
          <div class="uk-navbar-left">
            <ul class="uk-navbar-nav">
              <li>
                <a href="#manage-category" uk-toggle on:click={handleManageCategory}>Category</a>
              </li>
            </ul>
          </div>
          <div class="uk-navbar-right">
            <ul class="uk-navbar-nav">
              <li>
                <a href="#add-task" class="uk-position-relative" uk-toggle on:click={handleAddTask}>
                  <span class="uk-icon-button" uk-icon="icon: plus"></span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</div>
<!--for bigger devices-->
<div id="navbar" class="uk-hidden-xs">
  <div uk-sticky="start: 170; animation: uk-animation-slide-top; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent uk-dark; end: !main; offset: 0">
    <nav class="uk-navbar-container">
      <div class="uk-container">
        <div uk-navbar>
          <a href="#filtration" class="uk-navbar-item uk-logo" uk-scroll>
            <img src="{logo}" alt="logo" width="40" height="40" />
          </a>
          <div class="uk-navbar-left">
            <ul class="uk-navbar-nav">
              <li>
                <a href="#manage-category" uk-toggle on:click={handleManageCategory}>Category</a>
              </li>
            </ul>
          </div>
          <div class="uk-navbar-right">
            <ul class="uk-navbar-nav">
              <li>
                <a href="#add-task" class="uk-position-relative" uk-toggle on:click={handleAddTask}>
                  <span class="uk-icon-button" uk-icon="icon: plus"></span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</div>
