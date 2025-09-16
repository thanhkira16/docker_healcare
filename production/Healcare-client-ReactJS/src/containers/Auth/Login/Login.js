import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../../store/actions";
import "./Login.scss";
import { handleLoginApi, handleSignUpApi } from "../../../services/userService";

const Login = ({ language, navigate, userLoginSuccess }) => {
  const [state, setState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    errMsg: "",
    isShowEmail: false,
    isShowPassword: false,
    isShowConfirmPassword: false,
    isShowPhoneNumber: false,
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
      isShowEmail: false,
      isShowPassword: false,
      isShowConfirmPassword: false,
      isShowPhoneNumber: false,
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
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
                  <circle cx="20" cy="10" r="2"/>
                </svg>
              </div>
              <h1>VKU Healthcare</h1>
            </div>
            <p>
              Bạn có thể nhận được sự chăm sóc mình cần 24/7 – dù là trực tuyến 
              hay trực tiếp. Bạn sẽ được điều trị bởi các bác sĩ chuyên khoa tận tâm.
            </p>
            <div className="features">
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Bảo mật thông tin tuyệt đối</span>
              </div>
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>Dịch vụ 24/7</span>
              </div>
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span>Chăm sóc tận tâm</span>
              </div>
            </div>
          </div>

          {isOpenLogin ? (
            // Render login
            <div className="right col-lg-5 col-12">
              <div className="form-container">
                <div className="form-header">
                  <h2>Đăng nhập</h2>
                  <p>Chào mừng bạn trở lại với VKU Healthcare</p>
                </div>

                <div className="form-content gap-3">
                  <div className="input-group">
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div className="password-input">
                      <input
                        type={state.isShowEmail ? "text" : "password"}
                        className={
                          isValidLogin.email
                            ? "form-control"
                            : "form-control is-invalid"
                        }
                        placeholder="Địa chỉ email"
                        value={state.email}
                        name="email"
                        onChange={(event) =>
                          handleOnchangeInput(event, "email")
                        }
                        onKeyDown={(event) => handleKeyDown(event)}
                      />
                      {state.email && state.email !== "" && (
                        <span
                          className="show-hide"
                          onClick={() => handleTogglePassword("email")}
                        >
                          {state.isShowEmail ? (
                            <i className="fas fa-eye-slash"></i>
                          ) : (
                            <i className="fas fa-eye"></i>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <circle cx="12" cy="16" r="1"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <div className="password-input">
                      <input
                        type={state.isShowPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        className={
                          isValidLogin.password
                            ? "form-control"
                            : "form-control is-invalid"
                        }
                        value={state.password}
                        name="password"
                        onChange={(event) =>
                          handleOnchangeInput(event, "password")
                        }
                        onKeyDown={(event) => handleKeyDown(event)}
                      />
                      {state.password && state.password !== "" && (
                        <span
                          className="show-hide"
                          onClick={() => handleTogglePassword("password")}
                        >
                          {state.isShowPassword ? (
                            <i className="fas fa-eye-slash"></i>
                          ) : (
                            <i className="fas fa-eye"></i>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {state.errMsg && (
                    <div className="error-message">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      <span>{state.errMsg}</span>
                    </div>
                  )}

                  <span className="loginBtn" onClick={() => handleLogin()}>
                    Đăng nhập
                  </span>

                  <a href="" className="forget">
                    Quên mật khẩu?
                  </a>

                  <div className="sign-up">
                    <span
                      onClick={handleSwitchLoginAndSignUp}
                      className="signupBtn"
                    >
                      Tạo tài khoản mới
                    </span>
                  </div>
                </div>
              </div>

              <p className="create-page">
                <b>Tạo trang</b> dành cho bệnh viện, phòng khám hoặc doanh nghiệp.
              </p>
            </div>
          ) : (
            // Render sign up
            <div className="right col-lg-5 col-12">
              <div className="form-container">
                <div className="form-header">
                  <h2>Đăng ký</h2>
                  <p>Tạo tài khoản mới để sử dụng VKU Healthcare</p>
                </div>

                <div className="form-content gap-3">
                  <div className="input-group">
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div className="password-input">
                      <input
                        type={state.isShowEmail ? "text" : "password"}
                        placeholder="Địa chỉ email"
                        value={state.email}
                        name="email"
                        className={
                          isValidSignUp.email
                            ? "form-control"
                            : "form-control is-invalid"
                        }
                        onChange={(event) =>
                          handleOnchangeInput(event, "email")
                        }
                        onKeyDown={(event) => handleKeyDown(event)}
                      />
                      {state.email && state.email !== "" && (
                        <span
                          className="show-hide"
                          onClick={() => handleTogglePassword("email")}
                        >
                          {state.isShowEmail ? (
                            <i className="fas fa-eye-slash"></i>
                          ) : (
                            <i className="fas fa-eye"></i>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div className="password-input">
                      <input
                        type={state.isShowPhoneNumber ? "text" : "password"}
                        placeholder="Số điện thoại"
                        value={state.phoneNumber}
                        name="phoneNumber"
                        className={
                          isValidSignUp.phoneNumber
                            ? "form-control"
                            : "form-control is-invalid"
                        }
                        onChange={(event) =>
                          handleOnchangeInput(event, "phoneNumber")
                        }
                        onKeyDown={(event) => handleKeyDown(event)}
                      />
                      {state.phoneNumber && state.phoneNumber !== "" && (
                        <span
                          className="show-hide"
                          onClick={() => handleTogglePassword("phoneNumber")}
                        >
                          {state.isShowPhoneNumber ? (
                            <i className="fas fa-eye-slash"></i>
                          ) : (
                            <i className="fas fa-eye"></i>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <circle cx="12" cy="16" r="1"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <div className="password-input">
                      <input
                        type={state.isShowPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        value={state.password}
                        name="password"
                        onChange={(event) =>
                          handleOnchangeInput(event, "password")
                        }
                        className={
                          isValidSignUp.password
                            ? "form-control"
                            : "form-control is-invalid"
                        }
                        onKeyDown={(event) => handleKeyDown(event)}
                      />
                      {state.password && state.password !== "" && (
                        <span
                          className="show-hide"
                          onClick={() => handleTogglePassword("password")}
                        >
                          {state.isShowPassword ? (
                            <i className="fas fa-eye-slash"></i>
                          ) : (
                            <i className="fas fa-eye"></i>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <circle cx="12" cy="16" r="1"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <div className="password-input">
                      <input
                        type={state.isShowConfirmPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        value={state.confirmPassword}
                        name="confirmPassword"
                        className={
                          isValidSignUp.confirmPassword
                            ? "form-control"
                            : "form-control is-invalid"
                        }
                        onChange={(event) =>
                          handleOnchangeInput(event, "confirmPassword")
                        }
                        onKeyDown={(event) => handleKeyDown(event)}
                      />
                      {state.confirmPassword &&
                        state.confirmPassword !== "" && (
                          <span
                            className="show-hide"
                            onClick={() =>
                              handleTogglePassword("confirmPassword")
                            }
                          >
                            {state.isShowConfirmPassword ? (
                              <i className="fas fa-eye-slash"></i>
                            ) : (
                              <i className="fas fa-eye"></i>
                            )}
                          </span>
                        )}
                    </div>
                  </div>

                  {state.errMsg && (
                    <div className="error-message">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      <span>{state.errMsg}</span>
                    </div>
                  )}

                  <span
                    className="loginBtn"
                    onClick={() => handleSignUp()}
                  >
                    Đăng ký
                  </span>

                  <a
                    className="forget"
                    onClick={handleSwitchLoginAndSignUp}
                  >
                    Đã có tài khoản?
                  </a>
                </div>
              </div>
            </div>
          )}
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