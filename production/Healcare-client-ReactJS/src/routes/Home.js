import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PATHS from "../utils/path";

class Home extends Component {
  render() {
    const { isLoggedIn } = this.props;
    let linkToRedirect = isLoggedIn ? PATHS.SYSTEM.USER_MANAGE : PATHS.HOME;

    return <Redirect to={linkToRedirect} />;
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
