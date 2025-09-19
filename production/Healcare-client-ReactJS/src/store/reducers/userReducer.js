import actionTypes from "../actions/actionTypes";
import { getUserSession } from "../../utils/sessionStorage";

// Get initial state from localStorage if available
const getInitialState = () => {
  const session = getUserSession();
  if (session) {
    return {
      isLoggedIn: session.isLoggedIn,
      userInfo: session.userInfo,
    };
  }
  return {
    isLoggedIn: false,
    userInfo: null,
  };
};

const initialState = getInitialState();

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        userInfo: action.userInfo,
      };
    case actionTypes.USER_LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
      };
    case actionTypes.PROCESS_LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
      };
    default:
      return state;
  }
};

export default appReducer;
