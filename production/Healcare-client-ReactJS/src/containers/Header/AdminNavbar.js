import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import { adminMenu, doctorMenu } from "./menuApp";
import "./AdminNavbar.scss";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import { USER_ROLE } from "../../utils/constant";

class AdminNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLanguage: "vi",
      menuApp: this.getMenuByRole(props.userInfo),
      isMenuOpen: false,
      activeMenuItem: null,
      dropdownOpen: {}
    };
  }

  getMenuByRole = (userInfo) => {
    if (userInfo && userInfo.roleId === USER_ROLE.DOCTOR) {
      return doctorMenu;
    }
    return adminMenu; // Default to admin menu for admin or other roles
  }

  componentDidMount() {
    // Set active menu item based on current path
    this.setActiveMenuItem();
  }

  componentDidUpdate(prevProps) {
    // Update menu if user role changes
    if (prevProps.userInfo?.roleId !== this.props.userInfo?.roleId) {
      this.setState({
        menuApp: this.getMenuByRole(this.props.userInfo)
      });
    }

    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setActiveMenuItem();
    }
  }

  setActiveMenuItem = () => {
    const currentPath = this.props.location.pathname;
    const { menuApp } = this.state;
    let activeItem = null;

    menuApp.forEach((menu, menuIndex) => {
      menu.menus.forEach((item, itemIndex) => {
        if (item.link === currentPath) {
          activeItem = `${menuIndex}-${itemIndex}`;
        }
      });
    });

    this.setState({ activeMenuItem: activeItem });
  }

  handleLanguageClick = (language) => {
    this.props.changeLanguageAppRedux(language);
    this.setState({ activeLanguage: language });
  };

  handleLogout = () => {
    this.props.processLogout();
  };

  toggleMobileMenu = () => {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  };

  toggleDropdown = (menuIndex) => {
    this.setState(prevState => ({
      dropdownOpen: {
        ...prevState.dropdownOpen,
        [menuIndex]: !prevState.dropdownOpen[menuIndex]
      }
    }));
  };

  navigateToItem = (link) => {
    this.props.history.push(link);
    this.setState({ isMenuOpen: false }); // Close mobile menu
  };

  render() {
    const { userInfo } = this.props;
    const { activeLanguage, menuApp, isMenuOpen, activeMenuItem, dropdownOpen } = this.state;

    // Determine panel type based on user role
    const isDoctor = userInfo && userInfo.roleId === USER_ROLE.DOCTOR;
    const panelType = isDoctor ? "Doctor Panel" : "Admin Panel";

    return (
      <nav className="admin-navbar">
        <div className="navbar-container">
          {/* Brand/Logo */}
          <div className="navbar-brand">
            <div className="brand-logo">
              <i className="fas fa-hospital-alt"></i>
            </div>
            <div className="brand-text">
              <h3>HealthCare</h3>
              <span>{panelType}</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={this.toggleMobileMenu}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

          {/* Navigation Menu */}
          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <ul className="menu-list">
              {menuApp && menuApp.length > 0 &&
                menuApp.map((menu, menuIndex) => (
                  <li
                    key={menuIndex}
                    className={`menu-item ${dropdownOpen[menuIndex] ? 'active' : ''}`}
                  >
                    <div
                      className="menu-header"
                      onClick={() => this.toggleDropdown(menuIndex)}
                    >
                      <span className="menu-title">
                        <FormattedMessage id={menu.name} />
                      </span>
                      <i className={`fas fa-chevron-down ${dropdownOpen[menuIndex] ? 'rotated' : ''}`}></i>
                    </div>

                    <ul className={`submenu ${dropdownOpen[menuIndex] ? 'show' : ''}`}>
                      {menu.menus && menu.menus.length > 0 &&
                        menu.menus.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className={`submenu-item ${activeMenuItem === `${menuIndex}-${itemIndex}` ? 'active' : ''
                              }`}
                            onClick={() => this.navigateToItem(item.link)}
                          >
                            <i className="fas fa-circle submenu-icon"></i>
                            <span>
                              <FormattedMessage id={item.name} />
                            </span>
                          </li>
                        ))
                      }
                    </ul>
                  </li>
                ))
              }
            </ul>
          </div>

          {/* User Info & Actions */}
          <div className="navbar-actions">
            {/* Language Switcher */}
            <div className="language-switcher">
              <button
                className={`lang-btn ${activeLanguage === "vi" ? "active" : ""}`}
                onClick={() => this.handleLanguageClick("vi")}
              >
                VN
              </button>
              <button
                className={`lang-btn ${activeLanguage === "en" ? "active" : ""}`}
                onClick={() => this.handleLanguageClick("en")}
              >
                EN
              </button>
            </div>

            {/* User Profile */}
            <div className="user-profile">
              <div className="user-info">
                <div className="user-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="user-details">
                  <span className="user-greeting">
                    <FormattedMessage id="homeheader.welcome" />
                  </span>
                  <span className="user-name">
                    {userInfo && userInfo.firstName && userInfo.lastName
                      ? `${userInfo.firstName} ${userInfo.lastName}`
                      : (isDoctor ? "Doctor" : "Admin")}
                  </span>
                </div>
              </div>

              <button className="logout-btn" onClick={this.handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
    changeLanguageAppRedux: (language) =>
      dispatch(actions.changeLanguageApp(language)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminNavbar));