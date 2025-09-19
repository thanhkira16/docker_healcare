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
  const [loading, setLoading] = useState(true);

  const language = useSelector(state => state.app.language);

  // Fetch clinic details
  const fetchClinicDetails = async (clinicId) => {
    try {
      setLoading(true);
      const res = await getDetailClinicById({ id: clinicId });

      if (res && res.errCode === 0) {
        let listDoctors = res.listDoctors;
        let arrDoctorId = [];

        if (listDoctors && listDoctors.length > 0) {
          listDoctors.map((item) => {
            arrDoctorId.push(item.doctorId);
          });
        }

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
      if (dataDetailClinic.imageDisplay) {
        return dataDetailClinic.imageDisplay;
      }

      if (typeof dataDetailClinic.image === 'string') {
        return `data:image/jpeg;base64,${dataDetailClinic.image}`;
      } else {
        return Buffer.from(dataDetailClinic.image, "base64").toString("binary");
      }
    }
    return clinicImage;
  };

  return (
    <>
      <HomeHeader />
      <div className="detail-clinic-container">
        {/* Header Banner with Clinic Info - BookingCare Style */}
        <div className="clinic-header">
          <div className="clinic-header-content">
            <div className="clinic-logo">
              <img 
                src={getClinicImage()} 
                alt={dataDetailClinic?.name || "Clinic Logo"} 
              />
            </div>
            <div className="clinic-info">
              <h1 className="clinic-name">
                {dataDetailClinic?.name || "Bệnh viện Hữu nghị Việt Đức"}
              </h1>
              <p className="clinic-address">
                {dataDetailClinic?.address || "Nhà H, Tầng 1, số 16 Phủ Doãn, Phường Hàng Bông, Quận Hoàn Kiếm, Hà Nội"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="clinic-nav">
          <div className="nav-container">
            <div className="nav-tabs">
              <a href="#introduction" className="nav-tab active">GIỚI THIỆU</a>
              <a href="#specialties" className="nav-tab">THẾ MẠNH CHUYÊN MÔN</a>
              <a href="#equipment" className="nav-tab">TRANG THIẾT BỊ</a>
              <a href="#process" className="nav-tab">QUY TRÌNH KHÁM</a>
            </div>
          </div>
        </div>

        {/* Blue section with search and FAQ */}
        <div className="clinic-search-section">
          <div className="search-container">
            <div className="search-header">
              <h2>Hỏi nhanh, đáp chuẩn - Đặt khám dễ dàng với {dataDetailClinic?.name || "Bệnh viện Hữu nghị Việt Đức"}</h2>
            </div>
            <div className="search-input-wrapper">
              <input 
                type="text" 
                placeholder="Hỏi Trợ lý AI cách đặt lịch khám"
                className="search-input"
              />
              <button className="search-btn">
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            
            {/* FAQ Grid */}
            <div className="faq-grid">
              <div className="faq-item">
                <span className="faq-icon">+</span>
                <span className="faq-text">Khoa Nội-Hồi sức thần kinh Bệnh viện Hữu nghị Việt Đức nhận khám những bệnh gì?</span>
              </div>
              <div className="faq-item">
                <span className="faq-icon">+</span>
                <span className="faq-text">Lịch khám bác sĩ khoa Chi dưới, Bệnh viện Hữu nghị Việt Đức</span>
              </div>
              <div className="faq-item">
                <span className="faq-icon">+</span>
                <span className="faq-text">Khoa Thần Tiết niệu Bệnh viện Hữu nghị Việt Đức nhận khám những bệnh gì?</span>
              </div>
              <div className="faq-item">
                <span className="faq-icon">+</span>
                <span className="faq-text">Tôi muốn nói soi và cắt polyp trong ngày tại Bệnh viện Hữu nghị Việt Đức có được không?</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="clinic-main-content">
          <div className="content-container">
            {/* Introduction Section */}
            <section id="introduction" className="content-section">
              <h2 className="section-title">GIỚI THIỆU</h2>
              
              {/* Contact Info */}
              <div className="contact-info-box">
                <div className="info-item">
                  <strong>Địa chỉ:</strong> {dataDetailClinic?.address || "Bệnh viện có nhiều cổng, bệnh nhân đến khám sẽ đến cổng:"}
                </div>
                <div className="info-item">
                  <strong>• Số 16 Phủ Doãn, Hàng Bông, Hoàn Kiếm, Hà Nội</strong>
                </div>
                <div className="info-item">
                  <strong>Thời gian làm việc:</strong> Thứ 2 đến thứ 7
                </div>
                <div className="info-item">
                  <strong>• Sáng:</strong> 7h00 - 12h00
                </div>
                <div className="info-item">
                  <strong>• Chiều:</strong> 13h30 - 16h30
                </div>
              </div>

              {/* Description */}
              <div className="description-content">
                {dataDetailClinic?.descriptionHTML ? (
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: dataDetailClinic.descriptionHTML 
                    }}
                  />
                ) : (
                  <div className="default-description">
                    <p>Bệnh viện Việt Đức là một trong 5 bệnh viện tuyến Trung ương, hạng đặc biệt của Việt Nam. Bệnh viện có lịch sử trên 100 năm, bề dày truyền thống danh tiếng, là cái nôi của ngành ngoại khoa Việt Nam gắn liền với những thành tựu Y học quan trọng của đất nước.</p>
                    
                    <p>Việt Đức là địa chỉ uy tín hàng đầu về ngoại khoa, tiến hành khám bệnh, chữa bệnh và thực hiện các kỹ thuật chụp chiếu, xét nghiệm, thăm dò chức năng cơ bản và chuyên sâu hàng ngày cho người dân.</p>
                    
                    <p>Bệnh viện có đội ngũ y bác sĩ hùng hậu, nhiều người kiêm là cán bộ giảng dạy tại Đại học Y khoa Hà Nội hoặc Khoa Y Dược - Đại học Quốc gia Hà Nội. Trong số họ nhiều người là chuyên gia đầu ngành và bác sĩ giàu kinh nghiệm ở các chuyên khoa khác nhau.</p>
                    
                    <div className="important-notes">
                      <h3>Lưu ý quan trọng</h3>
                      <ul>
                        <li>Bệnh viện có nhiều khu khám bệnh, hiện tại BookingCare đang hỗ trợ đăng ký khám tại tòa nhà C4 - Khoa khám bệnh theo yêu cầu. Người bệnh đến khám đúng tòa nhà C4 để được hỗ trợ.</li>
                        <li>Bệnh viện chuyên về Ngoại khoa nên lịch của các bác sĩ thường linh động và ưu tiên khám cho các ca cấp cứu.</li>
                        <li>Mỗi bệnh nhân trong ngày chỉ được đặt trước 1 chuyên khoa, nếu đăng kí 2 chuyên khoa trở lên sẽ trao đổi bác sĩ thăm khám ban đầu chuyển khám thêm khoa khác.</li>
                      </ul>
                    </div>

                    <div className="pricing-info">
                      <h3>Chi phí khám</h3>
                      <p>Người bệnh có thể lựa chọn một trong các gói khám sau:</p>
                      <div className="pricing-packages">
                        <div className="package">
                          <h4>Gói 1:</h4>
                          <ul>
                            <li>Khám Giáo sư, Phó Giáo sư, Tiến sĩ, Bác sĩ Chuyên khoa II - Chi phí 500.000 đồng/lần khám</li>
                            <li>Khám với bác sĩ Trưởng khoa hoặc Phó khoa - Chi phí 500.000 đồng/lần khám</li>
                          </ul>
                        </div>
                        <div className="package">
                          <h4>Gói 2:</h4>
                          <ul>
                            <li>Khám Thạc sĩ, Bác sĩ Chuyên khoa I - Chi phí: 300.000 đồng/lần khám</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Specialties Section */}
            <section id="specialties" className="content-section">
              <h2 className="section-title">THẾ MẠNH CHUYÊN MÔN</h2>
              <div className="specialties-content">
                <p>Bệnh viện Việt Đức là bệnh viện chuyên khoa Ngoại (phẫu thuật), có thế mạnh về khám, điều trị và Phẫu thuật nhiều chuyên khoa. Một số thế mạnh của Bệnh viện Việt Đức là:</p>
                
                <div className="specialty-list">
                  <div className="specialty-item">
                    <h4>• Khám, điều trị, phẫu thuật về Thần kinh (Thần kinh I, Thần kinh II):</h4>
                    <p>Chấn thương; Bệnh lý sọ não; Tuỷ sống; Dây thần kinh ngoại vi; Ứng dụng nội soi trong phẫu thuật thần kinh; Phẫu thuật thần kinh chức năng; Phẫu thuật u nền sọ;...</p>
                  </div>
                  
                  <div className="specialty-item">
                    <h4>• Khám, điều trị, phẫu thuật về Cơ xương khớp:</h4>
                    <div className="sub-specialties">
                      <p><strong>◦ Khám, điều trị, phẫu thuật về Chi trên và Y học thể thao:</strong> Khám các bệnh lý do chấn thương thể thao; Bệnh lý đứt dây chằng gối do chơi thể thao; Chấn thương chỉnh hình xương khớp; Phẫu thuật bàn tay; Bệnh lý cơ xương khớp về tay;...</p>
                      
                      <p><strong>◦ Khám, điều trị, phẫu thuật về Chi dưới:</strong> Điều trị thoái hóa khớp gối, khớp háng; Bệnh lý đứt dây chằng gối; Phẫu thuật khớp gối, khớp háng, khớp cổ chân; Bệnh lý về chân;...</p>
                      
                      <p><strong>◦ Khám, điều trị, phẫu thuật về Xương và điều trị ngoại trú:</strong> Nắn chỉnh về xương, tai nạn bị gãy tay gãy chân, tháo bột, kiểm tra lại sau khi nắn chỉnh về xương.</p>
                      
                      <p><strong>◦ Khám, điều trị, phẫu thuật về chấn thương chung:</strong> tháo đinh, kiếm tra lại sau mổ,...</p>
                    </div>
                  </div>
                  
                  <div className="specialty-item">
                    <h4>• Khám, điều trị, phẫu thuật về Cột sống:</h4>
                    <p>Bệnh lý cột sống; Đau vai gáy; Thoái hoá và thoát vị đĩa đệm; Chấn thương chỉnh hình cột sống; Trượt đốt sống; Vẹo cột sống; Bơm xi-măng vào thân đốt sống;...</p>
                  </div>
                  
                  <div className="specialty-item">
                    <h4>• Khám, điều trị, phẫu thuật về Tim mạch và lồng ngực:</h4>
                    <p>Khám và điều trị bệnh lý tim bẩm sinh trẻ em; Khám và điều trị các bệnh lý nội, ngoại khoa về tim mạch; Điều trị các bệnh lý phức tạp về động - tĩnh mạch bằng các phương pháp tiên tiến; Các bệnh lý về xương sườn;...</p>
                  </div>
                  
                  <div className="specialty-item">
                    <h4>• Khám, điều trị, phẫu thuật về Tạo hình-Hàm mặt-Thẩm mỹ:</h4>
                    <p>Bệnh lý và chấn thương vùng hàm mặt; Phục hồi tái tạo các cơ quan sau điều trị ung thư; Sửa chữa các dị tật sọ mặt; Nối vành tai đứt rời, mũi đứt rời; Phẫu thuật thẩm mĩ mi mắt, mũi, tạo hình ngực, bụng….</p>
                  </div>
                  
                  <div className="specialty-item">
                    <h4>• Khám, điều trị, phẫu thuật về Tiêu hóa:</h4>
                    <p>Cắt bỏ và tạo hình thực quản; Cắt khối tá tuỵ; Cắt toàn bộ dạ dày, cắt đại tràng các loại.</p>
                  </div>
                </div>
                
                <div className="other-specialties">
                  <h4>Ngoài ra, bệnh viện khám, điều trị, phẫu thuật các chuyên khoa khác như:</h4>
                  <div className="specialty-grid">
                    <div className="specialty-column">
                      <ul>
                        <li>Bệnh lý thần kinh</li>
                        <li>Nội - Hồi sức thần kinh</li>
                        <li>Bệnh tim mạch và lồng ngực</li>
                        <li>Phẫu thuật tim mạch - lồng ngực</li>
                        <li>Ngoại nhi và trẻ sơ sinh</li>
                        <li>Bệnh lý tiêu hóa</li>
                        <li>Phẫu thuật tiêu hóa</li>
                        <li>Bệnh cột sống/thoát vị đĩa đệm</li>
                      </ul>
                    </div>
                    <div className="specialty-column">
                      <ul>
                        <li>Chi trên và y học thể thao</li>
                        <li>Bệnh lý chi dưới</li>
                        <li>Khám xương và điều trị ngoại trú</li>
                        <li>Phẫu thuật chấn thương chung</li>
                        <li>Phẫu thuật tạo hình - hàm mặt - thẩm mỹ</li>
                        <li>Phục hồi chức năng</li>
                        <li>Nhiễm khuẩn</li>
                        <li>Phẫu thuật nhiễm khuẩn</li>
                      </ul>
                    </div>
                    <div className="specialty-column">
                      <ul>
                        <li>Bệnh đường tiết niệu</li>
                        <li>Bệnh nam học/nam khoa</li>
                        <li>Bệnh lý gan mật</li>
                        <li>Ung bướu</li>
                        <li>Thận lọc máu</li>
                        <li>Bệnh lý hậu môn trực tràng</li>
                        <li>Trung tâm ghép tạng</li>
                        <li>Phòng khám Tai mũi họng</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Equipment Section */}
            <section id="equipment" className="content-section">
              <h2 className="section-title">TRANG THIẾT BỊ</h2>
              <div className="equipment-content">
                <p>Bệnh viện Việt Đức được trang bị hầu hết các trang thiết bị hiện đại hàng đầu hiện nay phục vụ trong chẩn đoán và thực hiện các xét nghiệm cơ bản, xét nghiệm kỹ thuật cao như các xét nghiệm theo dõi bệnh nhân ghép tạng, các xét nghiệm chỉ điểm khối u.</p>
                
                <div className="equipment-list">
                  <ul>
                    <li>Xquang số hóa</li>
                    <li>Máy siêu âm</li>
                    <li>Máy chụp cắt lớp vi tính đa dãy CT Scan</li>
                    <li>Máy chụp cộng hưởng từ MRI 3.0 Tesla</li>
                    <li>Hệ thống chụp mạch máy chuyên dụng</li>
                    <li>Hệ thống PET/CT phát hiện ung thư sớm và đánh giá các bệnh lý tim mạch, thần kinh</li>
                    <li>Hệ thống máy sinh hóa miễn dịch tự động, máy sinh hóa tự động, máy xét nghiệm huyết học, xét nghiệm đông máu tự động…</li>
                  </ul>
                </div>
                
                <div className="endoscopy-equipment">
                  <h4>Các thiết bị thăm dò chức năng hỗ trợ thăm khám và thực hiện các thủ thuật nội soi tiêu hóa - gan mật:</h4>
                  <ul>
                    <li>Nội soi thực quản - dạ dày - tá tràng chẩn đoán</li>
                    <li>Nội soi đại trực tràng chẩn đoán</li>
                    <li>Nội soi đường mật - tụy ngược dòng ERCP</li>
                    <li>Siêu âm nội soi chẩn đoán bệnh lý thuộc cơ quan tiêu hóa, chọc hút tế bào</li>
                    <li>Nội soi can thiệp, nong hẹp đường tiêu hóa</li>
                    <li>Nội soi đặt stent khí quản, đặt sonde tá tràng</li>
                    <li>Nội soi can thiệp đại tràng</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Process Section */}
            <section id="process" className="content-section">
              <h2 className="section-title">QUY TRÌNH KHÁM</h2>
              <div className="process-content">
                <p><strong>Quy trình khám dành cho người bệnh đặt khám thông qua BookingCare</strong></p>
                
                <div className="process-benefits">
                  <p>Từ nay, người bệnh có thể đặt lịch tại Khu khám bệnh theo yêu cầu, Bệnh viện Hữu nghị Việt Đức thông qua hệ thống đặt khám BookingCare.</p>
                  
                  <ul>
                    <li>Được lựa chọn các giáo sư, tiến sĩ, bác sĩ chuyên khoa giàu kinh nghiệm</li>
                    <li>Hỗ trợ đặt khám trực tuyến trước khi đi khám (miễn phí đặt lịch)</li>
                    <li>Giảm thời gian chờ đợi khi làm thủ tục khám và ưu tiên khám trước</li>
                    <li>Nhận được hướng dẫn chi tiết sau khi đặt lịch</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Doctors Section */}
            {arrDoctorId && arrDoctorId.length > 0 && (
              <section className="doctors-section">
                <h2 className="section-title">ĐỘI NGŨ BÁC SĨ</h2>
                <div className="doctors-grid">
                  {arrDoctorId.map((doctorId, index) => (
                    <div key={doctorId} className="doctor-card">
                      <div className="doctor-profile">
                        <ProfileDoctor
                          doctorId={doctorId}
                          isShowDescription={true}
                        />
                      </div>
                      <div className="doctor-info-wrapper">
                        <div className="doctor-schedule">
                          <h4>Lịch khám</h4>
                          <DoctorSchedule doctorId={doctorId || -1} />
                        </div>
                        <div className="doctor-extra-info">
                          <h4>Thông tin thêm</h4>
                          <DoctorExtraInfor doctorId={doctorId || -1} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DetailClinic;