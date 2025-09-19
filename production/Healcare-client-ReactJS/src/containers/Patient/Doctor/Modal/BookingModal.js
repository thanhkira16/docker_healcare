import React, { Component } from "react";
import moment from "moment";
import "moment/locale/vi";
import { connect } from "react-redux";
import { LANGUAGES } from "../../../../utils";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../../store/actions";
import "./BookingModal.scss";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import { Button, Modal, ModalFooter, Input } from "reactstrap";
import { postPatientBookAppointment } from "../../../../services/userService";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      forWhom: "",
      selectedGender: "",
      birthday: "",
      doctorId: "",
      timeType: "",
      genders: "",
      textDate: "",
      isDatePickerOpen: false,
      errors: {},
      isLoading: false,
    };
  }

  componentDidMount() {
    this.props.getGenderStart();
  }

  validateInput = () => {
    const errors = {};

    if (!this.state.fullname.trim()) {
      errors.fullname = "Họ và tên là bắt buộc";
    }

    if (!this.state.phoneNumber.trim()) {
      errors.phoneNumber = "Số điện thoại là bắt buộc";
    } else if (!/^\d{10}$/g.test(this.state.phoneNumber)) {
      errors.phoneNumber = "Số điện thoại phải có 10 chữ số";
    }

    if (!this.state.email.trim()) {
      errors.email = "Email là bắt buộc";
    } else if (!/^\S+@\S+\.\S+$/.test(this.state.email)) {
      errors.email = "Định dạng email không hợp lệ";
    }

    if (!this.state.selectedGender) {
      errors.selectedGender = "Giới tính là bắt buộc";
    }

    if (!this.state.address.trim()) {
      errors.address = "Địa chỉ là bắt buộc";
    }

    if (!this.state.reason.trim()) {
      errors.reason = "Lý do khám là bắt buộc";
    }

    if (!this.state.birthday) {
      errors.birthday = "Ngày sinh là bắt buộc";
    }

    return errors;
  };

  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVI : item.valueEN;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };

  async componentDidUpdate(prevProps) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }

    if (this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.dataBookingModal !== prevProps.dataBookingModal) {
      let data = this.props.dataBookingModal;
      let timeType = this.props.dataBookingModal.timeType;
      let doctorId = data && !_.isEmpty(data) ? data.doctorId : "";
      this.setState({
        doctorId: doctorId,
        timeType: timeType,
      });
    }
  }

  handleCloseModal = () => {
    this.props.onCloseBookingModal();
  };

  handleOnchangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    
    // Clear error when user starts typing
    if (this.state.errors[id]) {
      let errorsCopy = { ...this.state.errors };
      delete errorsCopy[id];
      stateCopy.errors = errorsCopy;
    }
    
    this.setState({
      ...stateCopy,
    });
  };

  handleOnChangeSelect = (selectedOption) => {
    this.setState({ selectedGender: selectedOption });
    
    // Clear error when user selects
    if (this.state.errors.selectedGender) {
      let errorsCopy = { ...this.state.errors };
      delete errorsCopy.selectedGender;
      this.setState({ errors: errorsCopy });
    }
  };

  handleConfirmBooking = async () => {
    this.setState({ isLoading: true });
    const err = this.validateInput();
    this.setState({ errors: err });
    
    if (_.isEmpty(err)) {
      let timeString = this.buildTimeBooking(this.props.dataBookingModal);
      let date = new Date(this.state.birthday).getTime();
      let doctorName = this.buildDoctorName(this.props.dataBookingModal);
      
      let res = await postPatientBookAppointment({
        fullname: this.state.fullname,
        phoneNumber: this.state.phoneNumber,
        email: this.state.email,
        address: this.state.address,
        reason: this.state.reason,
        selectedGender: this.state.selectedGender.value,
        date: this.props.dataBookingModal.date,
        birthday: date,
        doctorId: this.state.doctorId,
        timeString: timeString,
        timeType: this.state.timeType,
        language: this.props.language,
        doctorName: doctorName,
      });
      
      if (res && res.errCode === 0) {
        this.setState({ isLoading: false });
        toast.success(
          <FormattedMessage id="patient.booking-modal.booking-success" />
        );
        this.handleCloseModal();
      } else {
        this.setState({ isLoading: false });
        toast.error(
          <FormattedMessage id="patient.booking-modal.booking-failded" />
        );
      }
    } else {
      this.setState({ isLoading: false });
    }
  };

  buildTimeBooking = (dataTime) => {
    let language = this.props.language;
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("dddd - MM/DD/YYYY");
      let formattedDate = this.capitalizeFirstLetter(date);
      return `${time} - ${formattedDate}`;
    }
  };

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  buildDoctorName = (dataTime) => {
    let language = this.props.language;
    if (dataTime && !_.isEmpty(dataTime)) {
      let doctorName =
        language === LANGUAGES.VI
          ? dataTime.doctorData.lastName + " " + dataTime.doctorData.firstName
          : dataTime.doctorData.firstName + " " + dataTime.doctorData.lastName;

      return doctorName;
    }
  };

  handleDatePickerClick = () => {
    this.setState((prevState) => ({
      isDatePickerOpen: !prevState.isDatePickerOpen,
    }));
  };

  convertDateToString = (date) => {
    let formattedDate = "";
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
    };

    if (this.props.language === LANGUAGES.VI) {
      formattedDate = date.toLocaleDateString("vi-VN", options);
    } else {
      formattedDate = date.toLocaleDateString("en-US", options);
    }

    return formattedDate;
  };

  handleOnChangeDatePicker = (date) => {
    let currDate;
    currDate = moment(date).add(0, "days").startOf("day").valueOf();

    this.setState({
      birthday: currDate,
      textDate: this.convertDateToString(date),
    });
    
    // Clear error when user selects date
    if (this.state.errors.birthday) {
      let errorsCopy = { ...this.state.errors };
      delete errorsCopy.birthday;
      this.setState({ errors: errorsCopy });
    }
  };

  render() {
    let { language, dataBookingModal } = this.props;
    let { isLoading, errors } = this.state;
    let doctorId =
      dataBookingModal && !_.isEmpty(dataBookingModal)
        ? dataBookingModal.doctorId
        : "";

    return (
      <>
        <Modal
          isOpen={this.props.isOpenModalBooking}
          centered
          className="booking-modal"
          size="lg"
        >
          <div className="booking-modal-content">
            {/* Doctor Profile Section */}
            <div className="doctor-profile-section">
              <ProfileDoctor
                doctorId={doctorId}
                dataBookingModal={dataBookingModal}
                isShowDescription={false}
              />
            </div>

            {/* Booking Form Section */}
            <div className="booking-form-section">
              <div className="form-header">
                <h3 className="form-title">
                  <FormattedMessage id="patient.booking-modal.booking-title" />
                </h3>
                <p className="form-subtitle">
                  Vui lòng điền đầy đủ thông tin để đặt lịch khám
                </p>
              </div>

              <div className="form-content">
                {/* Personal Information */}
                <div className="form-section">
                  <h4 className="section-title">Thông tin cá nhân</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="icon-user"></i>
                          <FormattedMessage id="patient.booking-modal.fullname" />
                          <span className="required">*</span>
                        </label>
                        <Input
                          type="text"
                          className={`form-input ${errors.fullname ? 'error' : ''}`}
                          value={this.state.fullname}
                          onChange={(event) =>
                            this.handleOnchangeInput(event, "fullname")
                          }
                          placeholder="Nhập họ và tên đầy đủ..."
                        />
                        {errors.fullname && (
                          <span className="error-text">{errors.fullname}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="icon-phone"></i>
                          <FormattedMessage id="patient.booking-modal.phonenumber" />
                          <span className="required">*</span>
                        </label>
                        <Input
                          type="text"
                          className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                          value={this.state.phoneNumber}
                          onChange={(event) =>
                            this.handleOnchangeInput(event, "phoneNumber")
                          }
                          placeholder="Nhập số điện thoại..."
                        />
                        {errors.phoneNumber && (
                          <span className="error-text">{errors.phoneNumber}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="icon-email"></i>
                          <FormattedMessage id="patient.booking-modal.email" />
                          <span className="required">*</span>
                        </label>
                        <Input
                          type="email"
                          className={`form-input ${errors.email ? 'error' : ''}`}
                          value={this.state.email}
                          onChange={(event) =>
                            this.handleOnchangeInput(event, "email")
                          }
                          placeholder="Nhập địa chỉ email..."
                        />
                        {errors.email && (
                          <span className="error-text">{errors.email}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="icon-gender"></i>
                          <FormattedMessage id="patient.booking-modal.gender" />
                          <span className="required">*</span>
                        </label>
                        <Select
                          value={this.state.selectedGender}
                          onChange={this.handleOnChangeSelect}
                          options={this.state.genders}
                          placeholder="Chọn giới tính..."
                          className={`custom-select ${errors.selectedGender ? 'error' : ''}`}
                          classNamePrefix="select"
                        />
                        {errors.selectedGender && (
                          <span className="error-text">{errors.selectedGender}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="icon-location"></i>
                          <FormattedMessage id="patient.booking-modal.address" />
                          <span className="required">*</span>
                        </label>
                        <Input
                          type="text"
                          className={`form-input ${errors.address ? 'error' : ''}`}
                          value={this.state.address}
                          onChange={(event) =>
                            this.handleOnchangeInput(event, "address")
                          }
                          placeholder="Nhập địa chỉ..."
                        />
                        {errors.address && (
                          <span className="error-text">{errors.address}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="icon-calendar"></i>
                          <FormattedMessage id="patient.booking-modal.birthday" />
                          <span className="required">*</span>
                        </label>
                        <div className={`date-picker-wrapper ${errors.birthday ? 'error' : ''}`}>
                          <DatePicker
                            onChange={this.handleOnChangeDatePicker}
                            value={this.state.birthday ? new Date(this.state.birthday) : null}
                            maxDate={new Date(new Date().getTime() - 24 * 60 * 60 * 1000)}
                            className="custom-date-picker-control"
                            calendarClassName="custom-calendar"
                            clearIcon={null}
                            format="dd/MM/yyyy"
                          />
                          <i className="date-icon"></i>
                        </div>
                        {errors.birthday && (
                          <span className="error-text">{errors.birthday}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="form-section">
                  <h4 className="section-title">Thông tin khám bệnh</h4>
                  <div className="form-group">
                    <label className="form-label">
                      <i className="icon-medical"></i>
                      <FormattedMessage id="patient.booking-modal.reason" />
                      <span className="required">*</span>
                    </label>
                    <Input
                      type="textarea"
                      className={`form-textarea ${errors.reason ? 'error' : ''}`}
                      value={this.state.reason}
                      onChange={(event) =>
                        this.handleOnchangeInput(event, "reason")
                      }
                      placeholder="Mô tả triệu chứng, lý do khám..."
                      rows="4"
                    />
                    {errors.reason && (
                      <span className="error-text">{errors.reason}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer-custom">
              <div className="footer-buttons">
                <Button
                  className="cancel-btn"
                  onClick={this.handleCloseModal}
                >
                  <i className="btn-icon cancel-icon"></i>
                  <FormattedMessage id="patient.booking-modal.btn-cancel" />
                </Button>
                <Button
                  className="confirm-btn"
                  onClick={this.handleConfirmBooking}
                  disabled={isLoading}
                >
                  <i className="btn-icon confirm-icon"></i>
                  <FormattedMessage id="patient.booking-modal.btn-confirm" />
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        <LoadingOverlay
          className="loading-overlay"
          active={isLoading}
          spinner
          text="Đang xử lý..."
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);