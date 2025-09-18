import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../../utils";
import HeaderLogo from "../../../../components/Header/HeaderLogo";
import "../scss/Footer.scss"

const Footer = ({ language }) => {
      
      return (
        <footer className="healthcare-footer">
          <div className="footer-content">
            <div className="footer-container">
              <div className="footer-grid">
                
                {/* Healthcare Brand Section */}
                <div className="footer-section brand-section">
                  <div className="footer-brand">
                    <HeaderLogo />
                    <p className="brand-tagline">
                      <FormattedMessage 
                        id="footer.tagline" 
                        defaultMessage="Nền tảng y tế sức khỏe toàn diện"
                      />
                    </p>
                  </div>
                  <div className="contact-info">
                    <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      <span>1900 2115</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      <span>support@vkuhealcare.edu.vn</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>
                        <FormattedMessage 
                          id="footer.address" 
                          defaultMessage="470 Trần Đại Nghĩa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng"
                        />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section">
                  <h4 className="section-title">
                    <FormattedMessage id="footer.quicklinks" defaultMessage="Liên kết nhanh" />
                  </h4>
                  <ul className="footer-links">
                    <li><a href="#specialties">
                      <FormattedMessage id="header.specialties" defaultMessage="Chuyên khoa" />
                    </a></li>
                    <li><a href="#facilities">
                      <FormattedMessage id="header.facilities" defaultMessage="Cơ sở y tế" />
                    </a></li>
                    <li><a href="#doctors">
                      <FormattedMessage id="header.doctors" defaultMessage="Bác sĩ" />
                    </a></li>
                    <li><a href="#about">
                      <FormattedMessage id="header.about" defaultMessage="Giới thiệu" />
                    </a></li>
                  </ul>
                </div>

                {/* Services Section */}
                <div className="footer-section">
                  <h4 className="section-title">
                    <FormattedMessage id="footer.services" defaultMessage="Dịch vụ y tế" />
                  </h4>
                  <ul className="footer-links">
                    <li><a href="#booking">
                      <FormattedMessage id="footer.booking" defaultMessage="Đặt lịch khám" />
                    </a></li>
                    <li><a href="#health-check">
                      <FormattedMessage id="footer.health-check" defaultMessage="Gói khám sức khỏe" />
                    </a></li>
                    <li><a href="#emergency">
                      <FormattedMessage id="footer.emergency" defaultMessage="Cấp cứu 24/7" />
                    </a></li>
                    <li><a href="#telemedicine">
                      <FormattedMessage id="footer.telemedicine" defaultMessage="Khám từ xa" />
                    </a></li>
                  </ul>
                </div>

                {/* Social & App Section */}
                <div className="footer-section">
                  <h4 className="section-title">
                    <FormattedMessage id="footer.connect" defaultMessage="Kết nối với chúng tôi" />
                  </h4>
                  <div className="social-links">
                    <a href="#" className="social-link facebook" aria-label="Facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="social-link youtube" aria-label="YouTube">
                      <i className="fab fa-youtube"></i>
                    </a>
                    <a href="#" className="social-link instagram" aria-label="Instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="social-link linkedin" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                  
                  <div className="app-download">
                    <p className="download-text">
                      <FormattedMessage id="footer.download" defaultMessage="Tải ứng dụng" />
                    </p>
                    <div className="download-buttons">
                      <a href="#" className="download-btn">
                        <i className="fab fa-apple"></i>
                        <span>App Store</span>
                      </a>
                      <a href="#" className="download-btn">
                        <i className="fab fa-google-play"></i>
                        <span>Google Play</span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
