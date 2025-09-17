import React, { Component } from "react";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import { FormattedMessage } from "react-intl";

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRedux: [],
      userEdit: {},
    };
  }

  componentDidMount() {
    this.props.fetchUserRedux();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listUsers !== this.props.listUsers) {
      this.setState({ usersRedux: this.props.listUsers });
    }
  }

  handleDeleteUser = (user) => {
    this.props.deleteUserRedux(user.id);
  };

  handleEditUser = (user) => {
    console.log("Table manage", user);
    this.props.handleEditUserFromParent(user);
  };

  render() {
    let arrUsers = this.state.usersRedux;
    return (
      <>
        <div className="title mb-3">
          {" "}
          <FormattedMessage id="manage-user.manageUserTitle" />
        </div>

        <div className="user-table-content">
          <table className="table table-striped table-hover user-table">
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="manage-user.email" />
                </th>
                <th>
                  <FormattedMessage id="manage-user.firstname" />
                </th>
                <th>
                  <FormattedMessage id="manage-user.lastname" />
                </th>
                <th className="d-none d-md-table-cell">
                  <FormattedMessage id="manage-user.address" />
                </th>
                <th className="d-none d-md-table-cell">
                  <FormattedMessage id="manage-user.phonenumber" />
                </th>
                <th className="d-none d-md-table-cell">
                  <FormattedMessage id="manage-user.gender" />
                </th>
                <th>
                  <FormattedMessage id="manage-user.action" />
                </th>
              </tr>
            </thead>
            <tbody>
              {arrUsers && arrUsers.length > 0 ? (
                arrUsers.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.email}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td className="d-none d-md-table-cell">{item.address}</td>
                    <td className="d-none d-md-table-cell">{item.phonenumber}</td>
                    <td className="d-none d-md-table-cell">{item.gender}</td>
                    <td>
                      <button
                        className="btn-action edit"
                        title="Edit"
                        onClick={() => this.handleEditUser(item)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn-action delete"
                        title="Delete"
                        onClick={() => this.handleDeleteUser(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    <FormattedMessage id="manage-user.emptyMessage" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
    deleteUserRedux: (user) => dispatch(actions.deleteUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
