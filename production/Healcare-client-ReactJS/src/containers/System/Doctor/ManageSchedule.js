import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import moment from "moment";
import _ from "lodash";

// Components
import Select from "react-select";

// Actions and Services
import * as actions from "../../../store/actions";
import { LANGUAGES, dateFormat } from "../../../utils";
import { saveBulkScheduleDoctor } from "../../../services/userService";

// Styles
import "./ManageSchedule.scss";

const ManageSchedule = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { language, allDoctors, allScheduleTime } = useSelector(state => ({
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime
  }));

  // Local state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [displayDate, setDisplayDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Build doctor options for select
  const buildDoctorOptions = (doctors) => {
    if (!doctors || doctors.length === 0) return [];
    
    return doctors.map((doctor) => {
      const labelVi = `${doctor.lastName} ${doctor.firstName}`;
      const labelEn = `${doctor.firstName} ${doctor.lastName}`;
      return {
        value: doctor.id,
        label: language === LANGUAGES.VI ? labelVi : labelEn
      };
    });
  };

  // Format date for display
  const formatDateDisplay = (date) => {
    if (!date) return "";
    
    const options = {
      year: "numeric",
      month: "2-digit", 
      day: "2-digit",
      weekday: "long"
    };

    return language === LANGUAGES.VI 
      ? date.toLocaleDateString("vi-VN", options)
      : date.toLocaleDateString("en-US", options);
  };

  // Initialize data on component mount
  useEffect(() => {
    dispatch(actions.fetchAllDoctors());
    dispatch(actions.fetchAllScheduleTime());
  }, [dispatch]);

  // Update doctor options when allDoctors or language changes
  useEffect(() => {
    const options = buildDoctorOptions(allDoctors);
    setDoctorOptions(options);
  }, [allDoctors, language]);

  // Update time slots when allScheduleTime changes
  useEffect(() => {
    if (allScheduleTime && allScheduleTime.length > 0) {
      const slots = allScheduleTime.map((time) => ({
        ...time,
        isSelected: false
      }));
      setTimeSlots(slots);
    }
  }, [allScheduleTime]);

  // Handle doctor selection
  const handleDoctorChange = (selectedOption) => {
    setSelectedDoctor(selectedOption);
  };

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      setDisplayDate(formatDateDisplay(new Date(date)));
    } else {
      setDisplayDate("");
    }
  };

  // Handle time slot selection
  const handleTimeSlotClick = (timeSlot) => {
    const updatedSlots = timeSlots.map((slot) =>
      slot.id === timeSlot.id 
        ? { ...slot, isSelected: !slot.isSelected }
        : slot
    );
    setTimeSlots(updatedSlots);
  };

  // Handle save schedule
  const handleSaveSchedule = async () => {
    // Validation
    if (!selectedDoctor || _.isEmpty(selectedDoctor)) {
      toast.error(<FormattedMessage id="manage-schedules.invalidDoctor" />);
      return;
    }

    if (!selectedDate) {
      toast.error(<FormattedMessage id="manage-schedules.invalidDate" />);
      return;
    }

    const selectedTimeSlots = timeSlots.filter((slot) => slot.isSelected);
    if (selectedTimeSlots.length === 0) {
      toast.error("Vui lòng chọn ít nhất một khung giờ");
      return;
    }

    setIsLoading(true);
    try {
      // Format date to timestamp
      const formattedDate = new Date(selectedDate).getTime();
      
      // Build schedule array
      const scheduleArray = selectedTimeSlots.map((timeSlot) => ({
        doctorId: selectedDoctor.value,
        date: formattedDate,
        timeType: timeSlot.keyMap
      }));

      // Save schedule
      const response = await saveBulkScheduleDoctor({
        arraySchedule: scheduleArray,
        doctorId: selectedDoctor.value,
        formatedDate: formattedDate
      });

      if (response.errCode === 0) {
        toast.success(<FormattedMessage id="manage-schedules.saveChangesSuccess" />);
        // Reset selected time slots
        setTimeSlots(prev => prev.map(slot => ({ ...slot, isSelected: false })));
      } else {
        toast.error(<FormattedMessage id="manage-schedules.saveChangesFailed" />);
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error(<FormattedMessage id="manage-schedules.saveChangesFailed" />);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="manage-schedule-wrapper">
      <div className="manage-schedule-container">
        <div className="admin-header">
          <div className="admin-title">
            <h1>
              <FormattedMessage id="manage-schedules.title" />
            </h1>
          </div>
        </div>

        <div className="schedule-form">
          {/* Doctor and Date Selection */}
          <div className="form-row">
            {/* Doctor Selection */}
            <div className="form-group">
              <label className="form-label">
                <FormattedMessage id="manage-schedules.pick-doctor" />
              </label>
              <Select
                value={selectedDoctor}
                onChange={handleDoctorChange}
                options={doctorOptions}
                placeholder="Chọn bác sỹ..."
                className="doctor-select"
                classNamePrefix="select"
                isClearable
              />
            </div>

            {/* Date Selection */}
            <div className="form-group">
              <label className="form-label">
                <FormattedMessage id="manage-schedules.pick-date" />
              </label>
              <div className="date-picker-wrapper">
                <input
                  type="date"
                  value={selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="date-picker-field"
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="calendar-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                {displayDate && (
                  <div className="date-display">{displayDate}</div>
                )}
              </div>
            </div>
          </div>

          {/* Time Slots Selection */}
          <div className="time-slots-section">
            <h3 className="section-title">
              Chọn khung giờ khám
            </h3>
            <div className="time-slots-grid">
              {timeSlots.map((timeSlot, index) => (
                <button
                  key={index}
                  type="button"
                  className={`time-slot-btn ${timeSlot.isSelected ? 'selected' : ''}`}
                  onClick={() => handleTimeSlotClick(timeSlot)}
                >
                  {language === LANGUAGES.VI ? timeSlot.valueVI : timeSlot.valueEN}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-save"
              onClick={handleSaveSchedule}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Đang lưu...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <FormattedMessage id="manage-schedules.btnSave" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSchedule;
