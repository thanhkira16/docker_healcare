import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import HomeHeader from "../../HomePage/HomeHeader";
import { getDetailInfoDoctor } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import "./DetailDoctor.scss";
import "../../../styles/Base.scss";
import { FormattedMessage } from "react-intl";
import DoctorSchedule from "./DoctorSchedule";
import SchedulingToday from "./Modal/SchedulingToday";
import DoctorExtraInfor from "./DoctorExtraInfor";
import LikeAndShare from "../SocialPlugin/LikeAndShare";
import Footer from "../../HomePage/Section/Info/Footer";
import { toast } from "react-toastify";

const DetailDoctor = ({ language }) => {
  const [detailDoctor, setDetailDoctor] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    description: ""
  });
  
  const { id } = useParams();

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      if (id) {
        try {
          setLoading(true);
          const res = await getDetailInfoDoctor(id);
          if (res && res.data) {
            setDetailDoctor(res.data);
          }
          console.log("detail doctor", res);
        } catch (error) {
          console.error("Error fetching doctor info:", error);
          toast.error("Không thể tải thông tin bác sĩ");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDoctorInfo();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    toast.success("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
    setFormData({
      fullname: "",
      phone: "",
      description: ""
    });
  };

  if (loading) {
    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="detail-doctor-loading">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Đang tải thông tin bác sĩ...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  let nameVi = "";
  let nameEn = "";
  if (detailDoctor && detailDoctor.positionData) {
    nameVi = `${detailDoctor.positionData.valueVi} ${detailDoctor.lastName} ${detailDoctor.firstName}`;
    nameEn = `${detailDoctor.positionData.valueEn} ${detailDoctor.firstName} ${detailDoctor.lastName}`;
  }

  return (
    <div className="detail-doctor-page">
      <HomeHeader isShowBanner={false} />
      
      {/* Main Content */}
      <div className="detail-doctor-main">
        <div className="container">
          {/* Doctor Introduction Section */}
          <div className="doctor-hero-section">
            <div className="doctor-intro-card">
              <div className="doctor-avatar-container">
                <div
                  className="doctor-avatar"
                  style={{
                    backgroundImage: `url(${detailDoctor.image})`,
                  }}
                >
                  <div className="avatar-overlay">
                    <i className="fas fa-user-md"></i>
                  </div>
                </div>
              </div>
              
              <div className="doctor-info">
                <div className="doctor-header">
                  <h1 className="doctor-name">
                    {language === LANGUAGES.VI ? nameVi : nameEn}
                  </h1>
                </div>
                
                <p className="doctor-description">
                  {detailDoctor &&
                    detailDoctor.Markdown &&
                    detailDoctor.Markdown.description}
                </p>
                
                <div className="doctor-actions">
                  <div className="social-share">
                    <LikeAndShare />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule and Booking Section */}
          <div className="schedule-booking-section">
            <div className="row">
              <div className="col-lg-8 col-md-7">
                <div className="schedule-card">
                  <div className="card-header">
                    <h3><i className="fas fa-calendar-alt"></i> Lịch khám</h3>
                  </div>
                  <div className="card-body">
                    <DoctorSchedule
                      doctorId={detailDoctor && detailDoctor.id ? detailDoctor.id : -1}
                      isShowSeparator={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-5">
                <div className="booking-card">
                  <div className="card-header">
                    <h3><i className="fas fa-money-bill-wave"></i> Thông tin khám</h3>
                  </div>
                  <div className="card-body">
                    <DoctorExtraInfor
                      doctorId={detailDoctor && detailDoctor.id ? detailDoctor.id : -1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Details and Registration Section */}
          <div className="details-registration-section">
            <div className="row">
              <div className="col-lg-7 col-md-6">
                <div className="doctor-details-card">
                  <div className="card-header">
                    <h3><i className="fas fa-info-circle"></i> Thông tin chi tiết</h3>
                  </div>
                  <div className="card-body doctor-content">
                    {detailDoctor &&
                      detailDoctor.Markdown &&
                      detailDoctor.Markdown.contentHTML && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: detailDoctor.Markdown.contentHTML,
                          }}
                        />
                      )}
                  </div>
                </div>
              </div>
              
              <div className="col-lg-5 col-md-6">
                <div className="registration-card">
                  <div className="quick-registration">
                    <div className="card-header">
                      <h3>
                        <i className="fas fa-user-plus"></i>
                        <FormattedMessage id="homeheader.register" defaultMessage="Đăng ký khám" />
                      </h3>
                    </div>
                    
                    <form className="registration-form" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="fullname">
                          <i className="fas fa-user"></i>
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          id="fullname"
                          name="fullname"
                          value={formData.fullname}
                          onChange={handleInputChange}
                          placeholder="Nhập họ và tên"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="phone">
                          <i className="fas fa-phone"></i>
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          pattern="[0-9]{10,11}"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Nhập số điện thoại"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="description">
                          <i className="fas fa-comment"></i>
                          Mô tả triệu chứng
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows="4"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Mô tả triệu chứng hoặc lý do khám..."
                          required
                        ></textarea>
                      </div>
                      
                      <button type="submit" className="submit-btn">
                        <i className="fas fa-paper-plane"></i>
                        <span>
                          {language === "en" ? "Submit Registration" : "Gửi đăng ký"}
                        </span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
