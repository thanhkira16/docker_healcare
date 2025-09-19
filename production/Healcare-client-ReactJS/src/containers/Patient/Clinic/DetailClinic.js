import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DetailClinic.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { LANGUAGES } from "../../../utils";
import clinicImage from "../../../assets/header-background.jpg";
import { getDetailClinicById } from "../../../services/userService";
import Footer from "../../HomePage/Section/Info/Footer.js";

const DetailClinic = ({ match }) => {
  const [arrDoctorId, setArrDoctorId] = useState([]);
  const [dataDetailClinic, setDataDetailClinic] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  const language = useSelector(state => state.app.language);

  // Mock data cho các phần không có trong database
  const mockServices = [
    { id: 1, name: "Khám tổng quát", price: "500,000 VNĐ", duration: "30 phút", description: "Khám sức khỏe tổng quát, tư vấn y tế" },
    { id: 2, name: "Siêu âm tim", price: "800,000 VNĐ", duration: "45 phút", description: "Siêu âm tim màu, đánh giá chức năng tim" },
    { id: 3, name: "Xét nghiệm máu", price: "300,000 VNĐ", duration: "15 phút", description: "Xét nghiệm máu cơ bản, sinh hóa" },
  ];

  const workingHours = {
    "monday": "8:00 - 17:00",
    "tuesday": "8:00 - 17:00",
    "wednesday": "8:00 - 17:00",
    "thursday": "8:00 - 17:00",
    "friday": "8:00 - 17:00",
    "saturday": "8:00 - 12:00",
    "sunday": "Nghỉ"
  };

  // Fetch clinic details
  const fetchClinicDetails = async (clinicId) => {
    try {
      setLoading(true);
      const res = await getDetailClinicById({ id: clinicId });

      console.log("Clinic API Response:", res); // Debug log

      if (res && res.errCode === 0) {
        let listDoctors = res.listDoctors;
        let arrDoctorId = [];

        if (listDoctors && listDoctors.length > 0) {
          listDoctors.map((item) => {
            arrDoctorId.push(item.doctorId);
          });
        }

        // Make sure we log the entire data object to debug
        console.log("Clinic Data:", res.data);

        // Convert image to binary if it exists and is a buffer
        if (res.data && res.data.image) {
          const imageData = typeof res.data.image === 'object'
            ? Buffer.from(res.data.image).toString('binary')
            : res.data.image;

          res.data.imageDisplay = imageData;
        }

        setDataDetailClinic(res.data);
        setArrDoctorId(arrDoctorId);
      }
    } catch (error) {
      console.error("Error fetching clinic details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (match && match.params && match.params.id) {
      fetchClinicDetails(match.params.id);
    }
  }, [match]);

  const toggleExpand = () => {
    setExpanded(prevState => !prevState);
  };

  // Render loading state
  if (loading) {
    return (
      <>
        <HomeHeader />
        <div className="detail-clinic-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p><FormattedMessage id="common.loading" defaultMessage="Đang tải..." /></p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Image processing for display
  const getClinicImage = () => {
    if (dataDetailClinic && dataDetailClinic.image) {
      // If we already processed the image
      if (dataDetailClinic.imageDisplay) {
        return dataDetailClinic.imageDisplay;
      }

      // If image is base64 string, display it directly
      if (typeof dataDetailClinic.image === 'string') {
        return `data:image/jpeg;base64,${dataDetailClinic.image}`;
      } else {
        // If image is buffer, convert it
        return Buffer.from(dataDetailClinic.image, "base64").toString("binary");
      }
    }
    return clinicImage; // Default image
  };

  const contentToShow = dataDetailClinic && dataDetailClinic.descriptionHTML
    ? expanded
      ? dataDetailClinic.descriptionHTML
      : (dataDetailClinic.descriptionHTML.length > 200
        ? dataDetailClinic.descriptionHTML.slice(0, 200) + "..."
        : dataDetailClinic.descriptionHTML)
    : "";

  return (
    <>
      <HomeHeader />
      <div className="detail-clinic-container">
        {/* 1. Hero Section - Compact Banner */}
        <div className="hero-section">
          <div className="container">
            <div className="hero-content">
              <div className="hero-left">
                <div className="clinic-image">
                  <img src={getClinicImage()} alt={dataDetailClinic?.name || "Clinic"} />
                </div>
                <h1 className="clinic-name">
                  {dataDetailClinic?.name || "Phòng khám chuyên khoa"}
                </h1>
                <p className="clinic-specialty">
                  <i className="fas fa-stethoscope"></i>
                  {dataDetailClinic?.specialty || "Phòng khám đa khoa"}
                </p>
                <button
                  className="btn-book-now"
                  onClick={() => alert("Vui lòng liên hệ trực tiếp để đặt lịch khám!")}
                >
                  <i className="fas fa-calendar-plus"></i>
                  Đặt lịch ngay
                </button>
              </div>
              <div className="hero-right">

                <div className="contact-info">
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{dataDetailClinic?.address || "Số 16 - 18 Phủ Doãn, Hoàn Kiếm, Hà Nội"}</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-clock"></i>
                    <span>Thứ 2 - 6: 8:00 - 17:00, Thứ 7: 8:00 - 12:00</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <span>0123 456 789</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Content - 2 columns grid + separate map row */}
        <div className="main-content">
          <div className="container">
            <div className="content-grid">
              <div className="description-card info-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-info-circle"></i>
                    Giới thiệu
                  </h3>
                </div>
                <div className="card-content">
                  {dataDetailClinic?.descriptionHTML ? (
                    <div
                      className="description-content"
                      dangerouslySetInnerHTML={{
                        __html: expanded
                          ? dataDetailClinic.descriptionHTML
                          : (dataDetailClinic.descriptionHTML.length > 300
                            ? dataDetailClinic.descriptionHTML.slice(0, 300) + "..."
                            : dataDetailClinic.descriptionHTML
                          )
                      }}
                    />
                  ) : (
                    <div className="loading-content">
                      <p>Đang tải thông tin chi tiết...</p>
                    </div>
                  )}
                  {dataDetailClinic?.descriptionHTML && dataDetailClinic.descriptionHTML.length > 300 && (
                    <button className="btn-read-more" onClick={toggleExpand}>
                      <i className={`fas ${expanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                      {expanded ? "Thu gọn" : "Xem thêm"}
                    </button>
                  )}
                </div>
              </div>

              <div className="working-hours-card info-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-clock"></i>
                    Giờ làm việc
                  </h3>
                </div>
                <div className="card-content">
                  <div className="hours-list">
                    <div className="hour-item">
                      <span className="day">Thứ 2 - Thứ 6</span>
                      <span className="time">8:00 - 17:00</span>
                    </div>
                    <div className="hour-item">
                      <span className="day">Thứ 7</span>
                      <span className="time">8:00 - 12:00</span>
                    </div>
                    <div className="hour-item">
                      <span className="day">Chủ nhật</span>
                      <span className="time closed">Nghỉ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map section - separate row */}
            <div className="map-section">
              <div className="map-card info-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-map"></i>
                    Vị trí
                  </h3>
                </div>
                <div className="card-content">
                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3225817981167!2d106.6877265148617!3d10.787251392310804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0x3dbb34f78e6c7d3d!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBCYWNoIGtob2EgLSDEkEggUUc!5e0!3m2!1svi!2s!4v1629789012345!5m2!1svi!2s"
                      width="100%"
                      height="350"
                      style={{ border: 0, borderRadius: '8px' }}
                      allowFullScreen=""
                      loading="lazy"
                      title="Clinic Location"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Dịch vụ & Giá */}
        <div className="services-section">
          <div className="container">
            <div className="section-header">
              <h2>
                <i className="fas fa-medical-bag"></i>
                Dịch vụ & Giá
              </h2>
            </div>
            <div className="services-grid">
              {mockServices.map(service => (
                <div key={service.id} className="service-card">
                  <div className="service-header">
                    <h4>{service.name}</h4>
                    <div className="service-price">{service.price}</div>
                  </div>
                  <div className="service-body">
                    <p>{service.description}</p>
                    <div className="service-duration">
                      <i className="fas fa-clock"></i>
                      <span>{service.duration}</span>
                    </div>
                  </div>
                  <button
                    className="btn-book-service"
                    onClick={() => alert(`Liên hệ để đặt lịch dịch vụ: ${service.name}`)}
                  >
                    Đặt lịch
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Đội ngũ bác sĩ */}
        <div className="doctors-section">
          <div className="container">
            <div className="section-header">
              <h2>
                <i className="fas fa-user-md"></i>
                Đội ngũ bác sĩ
              </h2>
            </div>
            {arrDoctorId && arrDoctorId.length > 0 ? (
              <div className="doctors-grid">
                {arrDoctorId.map((doctorId, index) => (
                  <div key={doctorId} className="doctor-card">
                    <div className="doctor-profile">
                      <ProfileDoctor
                        doctorId={doctorId}
                        isShowDescription={true}
                      />
                    </div>
                    <div className="doctor-actions">
                      <button
                        className="btn-book-doctor"
                        onClick={() => alert(`Liên hệ để đặt lịch với bác sĩ #${doctorId}`)}
                      >
                        Đặt lịch với bác sĩ
                      </button>
                    </div>
                    <div className="doctor-info-grid">
                      <div className="doctor-schedule">
                        <h5>Lịch khám</h5>
                        <DoctorSchedule doctorId={doctorId || -1} />
                      </div>
                      <div className="doctor-extra-info">
                        <h5>Thông tin thêm</h5>
                        <DoctorExtraInfor doctorId={doctorId || -1} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-doctors">
                <i className="fas fa-user-md"></i>
                <h3>Chưa có thông tin bác sĩ</h3>
                <p>Vui lòng liên hệ trực tiếp để biết thêm thông tin về đội ngũ bác sĩ.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DetailClinic;