import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../../store/actions";
import "./Login.scss";
import { handleLoginApi, handleSignUpApi } from "../../../services/userService";
import InputField from "../../../components/Input/InputField";
import { FormattedMessage } from "react-intl";
import LanguageSwitcher from "../../../components/LanguageSwitcher";

const Login = ({ language, navigate, userLoginSuccess }) => {
  const [state, setState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    errMsg: "",
    isOpenLogin: true,
    isShowPassword: false,
    isShowConfirmPassword: false,
    isValidSignUp: {
      email: true,
      password: true,
      confirmPassword: true,
      phoneNumber: true,
    },
    isValidLogin: {
      email: true,
      password: true,
    },
  });

  useEffect(() => {
    document.title = "VKU Healthcare - login or sign up";
  }, []);

  const resetState = () => {
    setState(prev => ({
      ...prev,
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      errMsg: "",
      isOpenLogin: true,
      isShowPassword: false,
      isShowConfirmPassword: false,
      isValidSignUp: {
        email: true,
        password: true,
        confirmPassword: true,
        phoneNumber: true,
      },
      isValidLogin: {
        email: true,
        password: true,
      },
    }));
  };

  const handleOnchangeInput = (event, id) => {
    const valueInput = event.target.value;
    setState(prev => ({
      ...prev,
      [id]: valueInput,
    }));
  };

  const handleSwitchLoginAndSignUp = () => {
    resetState();
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isOpenLogin: !prev.isOpenLogin,
      }));
    }, 200);
  };

  const validateLogin = () => {
    const { email, password } = state;
    const isValidLogin = {
      email: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email),
      password: password.trim() !== "",
    };

    setState(prev => ({ ...prev, isValidLogin }));
    return Object.values(isValidLogin).every((value) => value);
  };

  const validateSignUp = () => {
    const { email, password, confirmPassword, phoneNumber } = state;
    const isValidSignUp = {
      email: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z.]+$/.test(email),
      password: password.trim() !== "",
      confirmPassword: confirmPassword === password,
      phoneNumber: /^[0-9]+$/.test(phoneNumber),
    };

    setState(prev => ({ ...prev, isValidSignUp }));
    return Object.values(isValidSignUp).every((value) => value);
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      setState(prev => ({ ...prev, errMsg: "" }));

      try {
        const { email, password } = state;
        let data = await handleLoginApi(email, password);
        console.log(data.user);

        if (data && data.errCode !== 0) {
          setState(prev => ({ ...prev, errMsg: data.message }));
        }
        if (data && data.errCode === 0) {
          userLoginSuccess(data.user);
          console.log("Login successful");
        } else {
          console.log("errMsg", state.errMsg);
        }
      } catch (e) {
        if (e.response) {
          if (e.response.data) {
            setState(prev => ({ ...prev, errMsg: e.response.data.message }));
          }
        }
        console.log(e.response);
      }
    }
  };

  const handleSignUp = async () => {
    console.log("signUp");
    if (validateSignUp()) {
      setState(prev => ({ ...prev, errMsg: "" }));

      try {
        const { email, phoneNumber, password } = state;
        console.log(email, phoneNumber, password);
        let data = await handleSignUpApi(email, phoneNumber, password);
        console.log(data.user);

        if (data && data.errCode !== 0) {
          setState(prev => ({ ...prev, errMsg: data.message }));
        }
        if (data && data.errCode === 0) {
          userLoginSuccess(data.user);
          console.log("Login successful");
        } else {
          console.log("errMsg", state.errMsg);
        }
      } catch (e) {
        if (e.response) {
          if (e.response.data) {
            setState(prev => ({ ...prev, errMsg: e.response.data.message }));
          }
        }
        console.log(e.response);
      }
    }
  };

  const handleTogglePassword = (id) => {
    setState(prev => ({
      ...prev,
      [`isShow${id.charAt(0).toUpperCase() + id.slice(1)}`]: !prev[`isShow${id.charAt(0).toUpperCase() + id.slice(1)}`],
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (state.isOpenLogin) {
        handleLogin();
      } else {
        handleSignUp();
      }
    }
  };

  console.log("state", state);
  const { isOpenLogin, isValidLogin, isValidSignUp } = state;

  return (
    <>
      <div className="container-fluid">
        <div className="row login-container">
          <div className="left col-7 d-none d-lg-block">
            <div className="logo-section">
              <div className="healthcare-logo">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                  <circle cx="20" cy="10" r="2" />
                </svg>
              </div>
              <h1>VKU Healthcare</h1>
            </div>
            <p>
              <FormattedMessage id="banner.desc" />
            </p>
            <div className="features">
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span><FormattedMessage id="footer.verified" /></span>
              </div>
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <span><FormattedMessage id="header.telehealth" /></span>
              </div>
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span><FormattedMessage id="footer.certified" /></span>
              </div>
            </div>
          </div>

          <div className="right col-lg-5 col-12">
            {/* Header with Language Switcher */}
            <div className="login-header">
              <div className="login-language-switcher">
                <LanguageSwitcher showLabel={true} type="minimal" />
              </div>
            </div>

            {isOpenLogin ? (
              // Render login
              <>
                <div className="form-container">
                  <div className="form-header">
                    <h2><FormattedMessage id="auth.login_title" /></h2>
                    <p><FormattedMessage id="auth.login_subtitle" /></p>
                  </div>

                  <div className="form-content gap-3">
                    <InputField
                      type="email"
                      placeholder={<FormattedMessage id="auth.email_placeholder" />}
                      value={state.email}
                      name="email"
                      isValid={isValidLogin.email}
                      onChange={(event) => handleOnchangeInput(event, "email")}
                      onKeyDown={handleKeyDown}
                      iconType="email"
                    />

                    <InputField
                      type="password"
                      placeholder={<FormattedMessage id="auth.password_placeholder" />}
                      value={state.password}
                      name="password"
                      isValid={isValidLogin.password}
                      onChange={(event) => handleOnchangeInput(event, "password")}
                      onKeyDown={handleKeyDown}
                      isShow={state.isShowPassword}
                      onToggle={() => handleTogglePassword("password")}
                      iconType="password"
                    />

                    {state.errMsg && (
                      <div className="error-message">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        <span>{state.errMsg}</span>
                      </div>
                    )}

                    <span className="loginBtn" onClick={() => handleLogin()}>
                      <FormattedMessage id="auth.login_button" />
                    </span>

                    <a href="" className="forget">
                      <FormattedMessage id="auth.forgot_password" />
                    </a>

                    <div className="sign-up">
                      <span
                        onClick={handleSwitchLoginAndSignUp}
                        className="signupBtn"
                      >
                        <FormattedMessage id="auth.create_account" />
                      </span>
                    </div>
                  </div>
                </div>

                <p className="create-page">
                  <b><FormattedMessage id="auth.create_page" /></b>
                </p>
              </>
            ) : (
              // Render sign up
              <div className="form-container">
                <div className="form-header">
                  <h2><FormattedMessage id="auth.signup_title" /></h2>
                  <p><FormattedMessage id="auth.signup_subtitle" /></p>
                </div>

                <div className="form-content gap-3">
                  <InputField
                    type="email"
                    placeholder={<FormattedMessage id="auth.email_placeholder" />}
                    value={state.email}
                    name="email"
                    isValid={isValidSignUp.email}
                    onChange={(event) => handleOnchangeInput(event, "email")}
                    onKeyDown={handleKeyDown}
                    iconType="email"
                  />

                  <InputField
                    type="tel"
                    placeholder={<FormattedMessage id="auth.phone_placeholder" />}
                    value={state.phoneNumber}
                    name="phoneNumber"
                    isValid={isValidSignUp.phoneNumber}
                    onChange={(event) => handleOnchangeInput(event, "phoneNumber")}
                    onKeyDown={handleKeyDown}
                    iconType="phone"
                  />

                  <InputField
                    type="password"
                    placeholder={<FormattedMessage id="auth.password_placeholder" />}
                    value={state.password}
                    name="password"
                    isValid={isValidSignUp.password}
                    onChange={(event) => handleOnchangeInput(event, "password")}
                    onKeyDown={handleKeyDown}
                    isShow={state.isShowPassword}
                    onToggle={() => handleTogglePassword("password")}
                    iconType="password"
                  />

                  <InputField
                    type="password"
                    placeholder={<FormattedMessage id="auth.confirm_password_placeholder" />}
                    value={state.confirmPassword}
                    name="confirmPassword"
                    isValid={isValidSignUp.confirmPassword}
                    onChange={(event) => handleOnchangeInput(event, "confirmPassword")}
                    onKeyDown={handleKeyDown}
                    isShow={state.isShowConfirmPassword}
                    onToggle={() => handleTogglePassword("confirmPassword")}
                    iconType="confirmPassword"
                  />

                  {state.errMsg && (
                    <div className="error-message">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      <span>{state.errMsg}</span>
                    </div>
                  )}

                  <span
                    className="loginBtn"
                    onClick={() => handleSignUp()}
                  >
                    <FormattedMessage id="auth.signup_button" />
                  </span>

                  <a
                    className="forget"
                    onClick={handleSwitchLoginAndSignUp}
                  >
                    <FormattedMessage id="auth.already_have_account" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);