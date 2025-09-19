import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";
import {
  userIsAuthenticated,
  userIsNotAuthenticated,
  userIsAdmin,
} from "../hoc/authentication";
import PATHS from "../utils/path";
import Home from "../routes/Home";
import Login from "./Auth/Login/Login.js";
import './App.scss';
import System from "../routes/System";
import HomePage from "./HomePage/HomePage.js";
import CustomScrollbars from "../components/CustomScrollbars/CustomScrollbars";
import DetailDoctor from "./Patient/Doctor/DetailDoctor";
import Doctor from "../routes/Doctor";
import VerifyEmail from "./Patient/VerifyEmail";
import DetailSpecialty from "./Patient/Specialty/DetailSpecialty";
import DetailClinic from "./Patient/Clinic/DetailClinic";
class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
            <div className="main-container">
              <div className="content-container">
                <Switch>
                  <Route path={PATHS.HOME} exact component={Home} />
                  <Route
                    path={PATHS.LOGIN}
                    component={userIsNotAuthenticated(Login)}
                  />
                  <Route
                    path={PATHS.SYSTEM.BASE}
                    component={userIsAdmin(System)}
                  />
                  <Route
                    path={PATHS.DOCTOR.BASE}
                    component={userIsAuthenticated(Doctor)}
                  />
                  <Route path={PATHS.HOMEPAGE} component={HomePage} />
                  <Route path={PATHS.DETAIL_DOCTOR} component={DetailDoctor} />
                  <Route
                    path={PATHS.DETAIL_SPECIALTY}
                    component={DetailSpecialty}
                  />
                  <Route path={PATHS.DETAIL_CLINIC} component={DetailClinic} />
                  <Route
                    path={PATHS.VERIFY_EMAIL_BOOKING}
                    component={VerifyEmail}
                  />
                </Switch>
              </div>

              <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </CustomScrollbars>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);