import React from 'react';

const Navbar = ({ handleAddTask }) => {
  let logo = '/assets/logo.png';
  return (
    <div>
      {/* Navbar for small devices */}
      <div id="navbar" className="uk-hidden@xl uk-hidden@l uk-hidden@m uk-hidden@s uk-position-bottom">
        <div uk-sticky="start: 170; position: bottom; animation: uk-animation-slide-bottom; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent uk-dark; end: !html; offset: 0">
          <nav className="uk-navbar-container">
            <div className="uk-container">
              <div uk-navbar="true">
                <a href="#filtration" className="uk-navbar-item uk-logo" uk-scroll="true">
                  <img src={logo} alt="logo" width="40" height="40" />
                </a>
                <div className="uk-navbar-left">
                  <ul className="uk-navbar-nav">
                    <li>
                      <a href="" uk-toggle="target: #manage-category" >Category</a>
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
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Navbar for larger devices */}
      <div id="navbar" className="uk-hidden-xs">
        <div uk-sticky="start: 170; animation: uk-animation-slide-top; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent uk-dark; end: !body; offset: 0">
          <nav className="uk-navbar-container">
            <div className="uk-container">
              <div uk-navbar="true">
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
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
