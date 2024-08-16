import React from 'react';


const Navbar = ({ handleAddTask }) => {

  let logo = '/assets/logo.svg';

  return (
    <div>
      {/* Navbar for small devices */}
      <ResponsiveNavbar
        id="navbar-small"
        hiddenClass="uk-hidden@xl uk-hidden@l uk-hidden@m uk-hidden@s"
        stickyOptions="start: 170; position: bottom; animation: uk-animation-slide-bottom; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent uk-dark; end: !html; offset: 0"
        logo={logo}
        handleAddTask={handleAddTask}
      />

      {/* Navbar for larger devices */}
      <ResponsiveNavbar
        id="navbar-large"
        hiddenClass="uk-hidden-xs"
        stickyOptions="start: 170; animation: uk-animation-slide-top; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent uk-dark; end: !body; offset: 0"
        logo={logo}
        handleAddTask={handleAddTask}
      />
    </div>
  );
};

const ResponsiveNavbar = ({ id, hiddenClass, stickyOptions, logo, handleAddTask }) => (
  <div id={id} className={hiddenClass}>
    <div uk-sticky={stickyOptions}>
      <nav className="uk-navbar-container">
        <div className="uk-container">
          <div uk-navbar="true">
            <NavBarContent logo={logo} handleAddTask={handleAddTask} />
          </div>
        </div>
      </nav>
    </div>
  </div>
);

const NavBarContent = ({ logo, handleAddTask }) => (
  <>
    <a href="#filtration" className="uk-navbar-item uk-logo" uk-scroll="true">
      <img src={logo} alt="logo" width="40" height="40" />
    </a>
    <div className="uk-navbar-left">
      <ul className="uk-navbar-nav">
        <li>
          <a href="" uk-toggle="target: #manage-category">Category</a>
        </li>
      </ul>
    </div>
    <div className="uk-navbar-right">
      <ul className="uk-navbar-nav">
        <li>
          <a href="" className="uk-position-relative" uk-toggle="target: #add-task" onClick={handleAddTask}>
            <span className="uk-icon-button" uk-icon="icon: plus"></span>
          </a>
        </li>
      </ul>
    </div>
  </>
);

export default Navbar;
