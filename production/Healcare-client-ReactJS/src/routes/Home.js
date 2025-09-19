import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PATHS from "../utils/path";
import { USER_ROLE } from "../utils/constant";

class Home extends Component {
  render() {
    const { isLoggedIn, userInfo } = this.props;

    // If user is logged in and is admin, redirect to system management
    if (isLoggedIn && userInfo && userInfo.roleId === USER_ROLE.ADMIN) {
      return <Redirect to={PATHS.SYSTEM.USER_MANAGE} />;
    }

    // For all other cases (not logged in, or logged in but not admin), go to homepage
    return <Redirect to={PATHS.HOMEPAGE} />;
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
