import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils/constant";
import { changeLanguageApp } from "../../store/actions";
import HeaderLogo from "../../components/Header/HeaderLogo";

class HomeHeader extends Component {
    state = {
        isDropdownOpen: false
    };

    dropdownRef = React.createRef();

    componentDidMount() {
        // Add click outside listener
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        // Remove click outside listener
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
            this.setState({ isDropdownOpen: false });
        }
    };

    toggleDropdown = (e) => {
        e.stopPropagation();
        this.setState(prevState => ({
            isDropdownOpen: !prevState.isDropdownOpen
        }));
    };

    handleChangeLanguage = (language) => {
        // Close dropdown if open
        this.setState({ isDropdownOpen: false });
        // Dispatch language change
        this.props.changeLanguageAppRedux(language);
    };

    render() {
        const { language } = this.props;
        const { isDropdownOpen } = this.state;

        return (
            <div className="header">
                <div className="navbar-container">
                    {/* Replace Brand Section with HeaderLogo */}
                    <HeaderLogo />

                    {/* Search Section */}
                    <div className="navbar-search">
                        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="search-input-wrapper">
                                <i className="fas fa-search search-icon"></i>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder={language === LANGUAGES.VI ?
                                        <FormattedMessage id="header.search" /> :
                                        <FormattedMessage id="header.search" />
                                    }
                                />
                            </div>
                        </form>
                    </div>

                    {/* Menu Section */}
                    <div className="navbar-menu">
                        <ul className="nav-list">
                            <li className="nav-item">
                                <a href="#specialties">
                                    <i className="fas fa-stethoscope"></i>
                                    <span><FormattedMessage id="header.specialties" /></span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#facilities">
                                    <i className="fas fa-hospital"></i>
                                    <span><FormattedMessage id="header.facilities" /></span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#doctors">
                                    <i className="fas fa-user-md"></i>
                                    <span><FormattedMessage id="header.doctors" /></span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#about">
                                    <i className="fas fa-info-circle"></i>
                                    <span><FormattedMessage id="header.about" /></span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Actions Section */}
                    <div className="navbar-actions">
                        <div className="language-switcher">
                            <div className="language-toggle">
                                <span
                                    className={`lang-option ${language === LANGUAGES.VI ? 'active' : ''}`}
                                    onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
                                >
                                    VN
                                </span>
                                <span
                                    className={`lang-option ${language === LANGUAGES.EN ? 'active' : ''}`}
                                    onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
                                >
                                    EN
                                </span>
                                <div className={`toggle-slider ${language === LANGUAGES.VI ? 'left' : 'right'}`}></div>
                            </div>
                            <span className="language-label">
                                <FormattedMessage id="header.language" />
                            </span>
                        </div>

                        <button className="contact-btn">
                            <i className="fas fa-phone"></i>
                            <span className="contact-text">
                                <FormattedMessage id="header.contact" />
                            </span>
                        </button>

                        <div className="user-profile-dropdown" ref={this.dropdownRef}>
                            <div className="user-avatar-trigger" onClick={this.toggleDropdown}>
                                <i className="fas fa-user-circle"></i>
                            </div>
                            <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                <div className="user-info">
                                    <i className="fas fa-user-circle dropdown-avatar"></i>
                                    <div className="user-details">
                                        <span className="user-name">Thị Kim Loan Nguyễn</span>
                                        <span className="user-role">Admin</span>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <button className="logout-btn">
                                    <i className="fas fa-sign-out-alt"></i>
                                    <span><FormattedMessage id="header.logout" /></span>
                                </button>
                            </div>
                        </div>

                        <button className="mobile-menu-toggle">
                            <span className="hamburger">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
});

const mapDispatchToProps = dispatch => ({
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);