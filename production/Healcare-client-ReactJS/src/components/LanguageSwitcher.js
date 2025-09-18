import React from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import { LANGUAGES } from "../utils";
import "./LanguageSwitcher.scss";
import { FormattedMessage } from "react-intl";

const LanguageSwitcher = ({ language, changeLanguageAppRedux, showLabel = true }) => {
  const switchLanguage = () => {
    const newLanguage = language === LANGUAGES.VI ? LANGUAGES.EN : LANGUAGES.VI;
    changeLanguageAppRedux(newLanguage);
  };

  const handleLanguageClick = (selectedLanguage) => {
    if (selectedLanguage !== language) {
      changeLanguageAppRedux(selectedLanguage);
    }
  };

  return (
    <div className="language-switcher">
      <div className="language-toggle">
        <span 
          className={`lang-option ${language === LANGUAGES.VI ? 'active' : ''}`}
          onClick={() => handleLanguageClick(LANGUAGES.VI)}
        >
          VN
        </span>
        <span 
          className={`lang-option ${language === LANGUAGES.EN ? 'active' : ''}`}
          onClick={() => handleLanguageClick(LANGUAGES.EN)}
        >
          EN
        </span>
        <div className={`toggle-slider ${language === LANGUAGES.EN ? 'right' : 'left'}`}></div>
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