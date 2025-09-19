import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
import { USER_ROLE } from "../utils/constant";
import PATHS from "../utils/path";

const locationHelper = locationHelperBuilder({});

export const userIsAuthenticated = connectedRouterRedirect({
  authenticatedSelector: (state) => state.user.isLoggedIn,
  wrapperDisplayName: "UserIsAuthenticated",
  redirectPath: PATHS.LOGIN,
});

export const userIsNotAuthenticated = connectedRouterRedirect({
  // Want to redirect the user when they are authenticated
  authenticatedSelector: (state) => !state.user.isLoggedIn,
  wrapperDisplayName: "UserIsNotAuthenticated",
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || PATHS.HOME,
  allowRedirectBack: false,
});

export const userIsAdmin = connectedRouterRedirect({
  authenticatedSelector: (state) => {
    // Debug logging
    console.log("userIsAdmin check:", {
      isLoggedIn: state.user.isLoggedIn,
      userInfo: state.user.userInfo,
      roleId: state.user.userInfo?.roleId,
      expectedRole: USER_ROLE.ADMIN,
      isAdmin: state.user.isLoggedIn &&
        state.user.userInfo &&
        state.user.userInfo.roleId === USER_ROLE.ADMIN
    });

    return state.user.isLoggedIn &&
      state.user.userInfo &&
      state.user.userInfo.roleId === USER_ROLE.ADMIN;
  },
  wrapperDisplayName: "UserIsAdmin",
  redirectPath: (state, ownProps) => {
    // If user is not logged in, redirect to login
    if (!state.user.isLoggedIn) {
      console.log("userIsAdmin: User not logged in, redirecting to login");
      return PATHS.LOGIN;
    }
    // If user is logged in but not admin, redirect to home
    console.log("userIsAdmin: User logged in but not admin, redirecting to home");
    return PATHS.HOME;
  },
  allowRedirectBack: false,
});
