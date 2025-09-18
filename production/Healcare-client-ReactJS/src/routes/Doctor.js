import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import AdminNavbar from "../containers/Header/AdminNavbar";
import ManageSchedule from "../containers/System/Doctor/ManageSchedule";
import ManagePatient from "../containers/System/Doctor/Patient/ManagePatient";
import PATHS from "../constants/path";

class Doctor extends Component {
  render() {
    const { isLoggedIn } = this.props;
    return (
      <>
        {isLoggedIn && <AdminNavbar />}
        <div className="Doctor-container">
          <div className="Doctor-list">
            <Switch>
              <Route
                path={PATHS.DOCTOR.MANAGE_SCHEDULE}
                component={ManageSchedule}
              />
              <Route path={PATHS.DOCTOR.MANAGE_PATIENT} component={ManagePatient} />
            </Switch>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    DoctorMenuPath: state.app.DoctorMenuPath,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
