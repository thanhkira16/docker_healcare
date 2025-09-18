import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils/constant";
import { changeLanguageApp } from "../../store/actions";
import HeaderLogo from "../../components/Header/HeaderLogo";
import LanguageSwitcher from "../../components/LanguageSwitcher";

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

    render() {
        const { language } = this.props;
        const { isDropdownOpen } = this.state;

        return (
            <div className="header">
                <div className="navbar-container">
                    <HeaderLogo />

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
                        {/* Use the LanguageSwitcher component */}
                        <LanguageSwitcher showLabel={true} />

                        <button className="contact-btn">
                            <i className="fas fa-phone"></i>
                            <span className="contact-text">
                                <FormattedMessage id="header.contact" />
                            </span>
                        </button>

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