import React from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import { LANGUAGES } from "../utils";
import "./LanguageSwitcher.scss";
import { FormattedMessage } from "react-intl";

const LanguageSwitcher = ({ language, changeLanguageAppRedux }) => {
  const switchLanguage = () => {
    const newLanguage = language === LANGUAGES.VI ? LANGUAGES.EN : LANGUAGES.VI;
    changeLanguageAppRedux(newLanguage);
  };

  return (
    <div className="language-switcher" onClick={switchLanguage}>
      <div className="language-toggle">
        <span className={`lang-option ${language === LANGUAGES.VI ? 'active' : ''}`}>
          VN
        </span>
        <span className={`lang-option ${language === LANGUAGES.EN ? 'active' : ''}`}>
          EN
        </span>
        <div className={`toggle-slider ${language === LANGUAGES.EN ? 'right' : 'left'}`}></div>
      </div>
      <span className="language-label">
        <FormattedMessage id="homeheader.language" />
      </span>
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