import React from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import { LANGUAGES } from "../../utils";
import { FormattedMessage } from "react-intl";

// Import both SCSS files
import "./LanguageSwitcher.scss";
import "./LanguageSwitcherMinimal.scss";

const LanguageSwitcher = ({
  language,
  changeLanguageAppRedux,
  showLabel = true,
  type = "modern" // "modern" or "minimal"
}) => {
  const handleLanguageClick = (selectedLanguage, event) => {
    // Prevent the click from bubbling up to the parent element
    event.stopPropagation();

    if (selectedLanguage !== language) {
      changeLanguageAppRedux(selectedLanguage);
    }
  };

  // New handler for clicking on the entire switcher
  const handleSwitcherClick = () => {
    const newLanguage = language === LANGUAGES.VI ? LANGUAGES.EN : LANGUAGES.VI;
    changeLanguageAppRedux(newLanguage);
  };

  // Modern type - for HomeHeader
  if (type === "modern") {
    return (
      <div className="language-switcher modern" onClick={handleSwitcherClick}>
        <div className="language-toggle">
          <span
            className={`lang-option ${language === LANGUAGES.VI ? 'active' : ''}`}
            onClick={(e) => handleLanguageClick(LANGUAGES.VI, e)}
          >
            VN
          </span>
          <span
            className={`lang-option ${language === LANGUAGES.EN ? 'active' : ''}`}
            onClick={(e) => handleLanguageClick(LANGUAGES.EN, e)}
          >
            EN
          </span>
          <div className={`toggle-slider ${language === LANGUAGES.EN ? 'right' : 'left'}`}></div>
        </div>
      </div>
    );
  }

  // Minimal type - for Login and Header
  return (
    <div className="language-switcher minimal" onClick={handleSwitcherClick}>
      <div className="language-options">
        <span
          className={`lang-option ${language === LANGUAGES.VI ? 'active' : ''}`}
          onClick={(e) => handleLanguageClick(LANGUAGES.VI, e)}
        >
          VN
        </span>
        <span className="separator">|</span>
        <span
          className={`lang-option ${language === LANGUAGES.EN ? 'active' : ''}`}
          onClick={(e) => handleLanguageClick(LANGUAGES.EN, e)}
        >
          EN
        </span>
      </div>
      {showLabel && (
        <span className="language-label">
          <FormattedMessage id="header.language" />
        </span>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSwitcher);