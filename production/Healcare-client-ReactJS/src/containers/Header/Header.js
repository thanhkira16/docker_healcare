import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu, doctorMenu } from "./menuApp";
import "./Header.scss";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import { USER_ROLE } from "../../utils/constant";
import { getAllSpecialties } from "../../services/userService";
import { LANGUAGES } from "../../utils";
import { withRouter } from "react-router";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLanguage: "vi",
      menuApp: [],
      // User header specific state
      isScrolled: false,
      isMobileMenuOpen: false,
      searchQuery: "",
      dataSpecialty: [],
      showSearchResults: false,
      showUserDropdown: false
    };
  }

  async componentDidMount() {
    let { userInfo } = this.props;
    let menu = [];

    // Set up menu for admin/doctor
    if (userInfo && !_.isEmpty(userInfo)) {
      let role = userInfo.roleId;
      if (role === USER_ROLE.ADMIN) {
        menu = adminMenu;
      }
      if (role === USER_ROLE.DOCTOR) {
        menu = doctorMenu;
      }
    }
    this.setState({ menuApp: menu });

    // Set up scroll listener and get specialties for user header
    if (!userInfo || _.isEmpty(userInfo)) {
      window.addEventListener('scroll', this.handleScroll);
      try {
        const res = await getAllSpecialties();
        if (res.errCode === 0) {
          this.setState({ dataSpecialty: res.data ? res.data : [] });
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const isScrolled = window.scrollY > 50;
    if (this.state.isScrolled !== isScrolled) {
      this.setState({ isScrolled });
    }
  };

  handleLanguageClick = (language) => {
    this.props.changeLanguageAppRedux(language);
    this.setState({ activeLanguage: language });
  };

  toggleMobileMenu = () => {
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen });
  };

  returnToHomePage = (e) => {
    e.preventDefault();
    this.props.history.push("/home");
  };

  handleSearchChange = (e) => {
    this.setState({
      searchQuery: e.target.value,
      showSearchResults: e.target.value.length > 0
    });
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search for:", this.state.searchQuery);
  };

  navigateToSection = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    this.setState({ isMobileMenuOpen: false });
  };

  handleUserDropdownEnter = () => {
    this.setState({ showUserDropdown: true });
  };

  handleUserDropdownLeave = () => {
    this.setState({ showUserDropdown: false });
  };

  render() {
    const { processLogout, userInfo, language, location } = this.props;
    const { activeLanguage, isScrolled, isMobileMenuOpen, searchQuery, showSearchResults, dataSpecialty, showUserDropdown } = this.state;

    // Check if this is an admin page (system or doctor routes)
    const isAdminPage = location && (location.pathname.startsWith('/system') || location.pathname.startsWith('/doctor'));
    const isLoggedIn = userInfo && !_.isEmpty(userInfo);

    // Render admin header only for admin pages with logged in users
    if (isAdminPage && isLoggedIn) {
      // Admin/Doctor Header (existing header)
      return (
        <div className="header-container">
          <div className="header-tabs-container">
            <Navigator menus={this.state.menuApp} />
          </div>
          <div className="languages">
            <span className="welcome">
              <FormattedMessage id="homeheader.welcome" />
              {userInfo.firstName && userInfo.lastName
                ? userInfo.firstName + " " + userInfo.lastName
                : ""}
            </span>
            {/* Use minimal type for admin header */}
            <LanguageSwitcher showLabel={false} type="minimal" />
            <div className="btn btn-logout" onClick={processLogout}>
              <i className="fas fa-sign-out-alt"></i>
            </div>
          </div>
        </div>
      );
    } else {
      // User Header (beautiful header for public users)
      return (
        <header className={`user-header ${isScrolled ? 'scrolled' : ''}`}>
          <nav className="user-navbar">
            <div className="navbar-container">
              {/* Logo Section */}
              <div className="navbar-brand">
                <a href="#" onClick={this.returnToHomePage} className="brand-link">
                  <div className="brand-logo">
                    <i className="fas fa-heartbeat"></i>
                  </div>
                  <div className="brand-text">
                    <h3>HealthCare</h3>
                    <span>Chăm sóc sức khỏe</span>
                  </div>
                </a>
              </div>

              {/* Search Section */}
              <div className="navbar-search">
                <form onSubmit={this.handleSearchSubmit} className="search-form">
                  <div className="search-input-wrapper">
                    <i className="fas fa-search search-icon"></i>
                    <input
                      type="text"
                      placeholder={language === LANGUAGES.VI ? "Tìm kiếm dịch vụ, bác sĩ..." : "Search services, doctors..."}
                      value={searchQuery}
                      onChange={this.handleSearchChange}
                      className="search-input"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="clear-search"
                        onClick={() => this.setState({ searchQuery: "", showSearchResults: false })}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {showSearchResults && (
                    <div className="search-results">
                      <div className="search-section">
                        <h6><FormattedMessage id="header.specialties" /></h6>
                        {dataSpecialty.slice(0, 3).map((item, index) => (
                          <div key={index} className="search-item">
                            <i className="fas fa-stethoscope"></i>
                            <span>{language === LANGUAGES.VI ? item.name : item.nameEn}</span>
                          </div>
                        ))}
                      </div>
                      <div className="search-section">
                        <h6><FormattedMessage id="header.quickActions" /></h6>
                        <div className="search-item">
                          <i className="fas fa-calendar-plus"></i>
                          <span><FormattedMessage id="header.bookAppointment" /></span>
                        </div>
                        <div className="search-item">
                          <i className="fas fa-user-md"></i>
                          <span><FormattedMessage id="header.findDoctor" /></span>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Navigation Menu */}
              <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <ul className="nav-list">
                  <li className="nav-item">
                    <a href="#specialties" onClick={() => this.navigateToSection('specialties')}>
                      <i className="fas fa-stethoscope"></i>
                      <span><FormattedMessage id="homeheader.speciality" /></span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#facilities" onClick={() => this.navigateToSection('facilities')}>
                      <i className="fas fa-hospital"></i>
                      <span><FormattedMessage id="homeheader.health-facility" /></span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#doctors" onClick={() => this.navigateToSection('doctors')}>
                      <i className="fas fa-user-md"></i>
                      <span><FormattedMessage id="homeheader.doctor" /></span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#about" onClick={() => this.navigateToSection('about')}>
                      <i className="fas fa-info-circle"></i>
                      <span><FormattedMessage id="homeheader.about" /></span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Actions Section */}
              <div className="navbar-actions">
                {/* Language Switcher - using minimal type for user header */}
                <LanguageSwitcher showLabel={false} type="minimal" />

                {/* Contact Button */}
                <button className="contact-btn">
                  <i className="fas fa-phone"></i>
                  <span className="contact-text">
                    <FormattedMessage id="header.contact" />
                  </span>
                </button>

                {/* User Profile (if logged in) */}
                {isLoggedIn && (
                  <div
                    className="user-profile-dropdown"
                    onMouseEnter={this.handleUserDropdownEnter}
                    onMouseLeave={this.handleUserDropdownLeave}
                  >
                    <div className="user-avatar-trigger">
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <div className={`dropdown-menu ${showUserDropdown ? 'show' : ''}`}>
                      <div className="user-info">
                        <i className="fas fa-user-circle dropdown-avatar"></i>
                        <div className="user-details">
                          <span className="user-name">
                            {userInfo.firstName && userInfo.lastName
                              ? `${userInfo.firstName} ${userInfo.lastName}`
                              : "User"}
                          </span>
                          <span className="user-role">
                            {userInfo.roleId === "R1" ? "Admin" : userInfo.roleId === "R2" ? "Doctor" : "Patient"}
                          </span>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <button className="logout-btn" onClick={processLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Mobile Menu Toggle */}
                <button
                  className="mobile-menu-toggle"
                  onClick={this.toggleMobileMenu}
                >
                  <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </button>
              </div>
            </div>
          </nav>
        </header>
      );
    }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));