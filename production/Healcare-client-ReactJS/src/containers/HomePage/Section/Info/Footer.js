import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../../utils";
import "../scss/Footer.scss"

class Footer extends Component {
   
    render() {
      const { language } = this.props;
      console.log('Footer language:', language); // Debug log
      
      return (
        <footer className="healthcare-footer">
          <div className="footer-content">
            <div className="footer-container">
              <div className="footer-grid">
                
                {/* Healthcare Brand Section */}
                <div className="footer-section brand-section">
                  <div className="footer-brand">
                    <div className="brand-logo">
                      <i className="fas fa-heartbeat"></i>
                    </div>
                    <h3 className="brand-name">HealthCare</h3>
                    <p className="brand-tagline">
                      <FormattedMessage 
                        id="footer.tagline" 
                        defaultMessage="Chăm sóc sức khỏe toàn diện cho mọi gia đình"
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
                      <span>support@healthcare.vn</span>
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

                {/* Services Section */}
                <div className="footer-section">
                  <h4 className="section-title">
                    <FormattedMessage id="footer.services" defaultMessage="Dịch vụ y tế" />
                  </h4>
                  <ul className="footer-links">
                    <li><a href="#specialties">
                      <FormattedMessage id="footer.specialties" defaultMessage="Chuyên khoa" />
                    </a></li>
                    <li><a href="#doctors">
                      <FormattedMessage id="footer.doctors" defaultMessage="Bác sĩ" />
                    </a></li>
                    <li><a href="#facilities">
                      <FormattedMessage id="footer.facilities" defaultMessage="Cơ sở y tế" />
                    </a></li>
                    <li><a href="#booking">
                      <FormattedMessage id="footer.booking" defaultMessage="Đặt lịch khám" />
                    </a></li>
                    <li><a href="#health-check">
                      <FormattedMessage id="footer.health-check" defaultMessage="Gói khám sức khỏe" />
                    </a></li>
                  </ul>
                </div>

                {/* Support Section */}
                <div className="footer-section">
                  <h4 className="section-title">
                    <FormattedMessage id="footer.support" defaultMessage="Hỗ trợ" />
                  </h4>
                  <ul className="footer-links">
                    <li><a href="#faq">
                      <FormattedMessage id="footer.faq" defaultMessage="Câu hỏi thường gặp" />
                    </a></li>
                    <li><a href="#guide">
                      <FormattedMessage id="footer.guide" defaultMessage="Hướng dẫn sử dụng" />
                    </a></li>
                    <li><a href="#privacy">
                      <FormattedMessage id="footer.privacy" defaultMessage="Chính sách bảo mật" />
                    </a></li>
                    <li><a href="#terms">
                      <FormattedMessage id="footer.terms" defaultMessage="Điều khoản sử dụng" />
                    </a></li>
                    <li><a href="#feedback">
                      <FormattedMessage id="footer.feedback" defaultMessage="Góp ý & khiếu nại" />
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
          
          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-container">
              <div className="footer-bottom-content">
                <div className="copyright">
                  <p>
                    © 2024 HealthCare Platform. 
                    <FormattedMessage 
                      id="footer.copyright" 
                      defaultMessage=" Bản quyền thuộc về VKU HealthCare."
                    />
                  </p>
                </div>
                <div className="certifications">
                  <span className="cert-item">
                    <i className="fas fa-shield-alt"></i>
                    <FormattedMessage id="footer.verified" defaultMessage="Đã được xác minh" />
                  </span>
                  <span className="cert-item">
                    <i className="fas fa-award"></i>
                    <FormattedMessage id="footer.certified" defaultMessage="Chứng nhận chất lượng" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      );
    }
  }

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
