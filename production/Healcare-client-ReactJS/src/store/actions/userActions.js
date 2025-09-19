import actionTypes from "./actionTypes";
import { saveUserSession, removeUserSession } from "../../utils/sessionStorage";

export const addUserSuccess = () => ({
  type: actionTypes.ADD_USER_SUCCESS,
});

export const userLoginSuccess = (userInfo) => {
  // Save user session to localStorage
  saveUserSession(userInfo);

  return {
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfo: userInfo,
  };
};

export const userLoginFail = () => ({
  type: actionTypes.USER_LOGIN_FAIL,
});

export const processLogout = () => {
  // Remove user session from localStorage
  removeUserSession();

  return {
    type: actionTypes.PROCESS_LOGOUT,
  };
};
