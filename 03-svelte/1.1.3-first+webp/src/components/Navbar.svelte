<script>
// @ts-nocheck
    import UIkit from 'uikit';
    import Icons from 'uikit/dist/js/uikit-icons';
    UIkit.use(Icons);

    let logo = '/assets/logo.png'
  </script>
    
<!--for small devices-->
<div id="navbar" class="uk-hidden@xl uk-hidden@l uk-hidden@m uk-hidden@s uk-position-bottom">
  <div uk-sticky="start: 170; position: bottom; animation: uk-animation-slide-bottom; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent uk-dark; end: !html; offset: 0">
    <nav class="uk-navbar-container">
      <div class="uk-container">
        <div uk-navbar>
          <a href="#filtration" class="uk-navbar-item uk-logo" uk-scroll>
              <img src="{logo}" alt="logo" />
          </a>
          <div class="uk-navbar-left">
              <ul class="uk-navbar-nav">
              <li><a href="#manage-category" uk-toggle>Category</a></li>
              </ul>
          </div>
          <div class="uk-navbar-right">
              <ul class="uk-navbar-nav">
              <li>
                  <a href="#add-task" class="uk-position-relative" uk-toggle>
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
              <img src="{logo}" alt="logo" />
          </a>
          <div class="uk-navbar-left">
              <ul class="uk-navbar-nav">
              <li><a href="#manage-category" uk-toggle>Category</a></li>
              </ul>
          </div>
          <div class="uk-navbar-right">
              <ul class="uk-navbar-nav">
              <li>
                  <a href="#add-task" class="uk-position-relative" uk-toggle>
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
  
  <style>
    .uk-navbar-container:not(.uk-navbar-transparent) {
      background: #717182 !important;
      color: #e1e1e8;
    }
    .uk-navbar-nav > li > a {
      justify-content: left !important;
      width: 9vw;
      font-weight: bold;
      color: #e1e1e8 !important;
    }
    .uk-navbar-nav > li > a:hover {
      color: #636365 !important;
    }
    .uk-navbar-nav > li:first-child > a {
      justify-content: center !important;
      width: 12vw;
    }
    .uk-logo img {
      width: 3rem;
      margin-right: 1rem;
    }

    .uk-hidden-xs { visibility: hidden; }


  </style>
  