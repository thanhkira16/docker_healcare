
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DetailSpecialty.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import Footer from "../../../containers/HomePage/Section/Info/Footer.js";
import { LANGUAGES } from "../../../utils";
import {
  getDetailSpecialtyById,
  getAllCodeService,
} from "../../../services/userService";

const DetailSpecialty = (props) => {
  const [arrDoctorId, setArrDoctorId] = useState([]);
  const [arrLocations, setArrLocations] = useState([]);
  const [dataDetailSpecialty, setDataDetailSpecialty] = useState({});
  const [listDoctors, setListDoctors] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialtyData = async () => {
      try {
        setLoading(true);
        if (
          props.match &&
          props.match.params &&
          props.match.params.id
        ) {
          // Get details specialty
          let id = props.match.params.id;
          let res = await getDetailSpecialtyById({
            id,
            location: "ALL",
          });

          if (res && res.errCode === 0) {
            let listDoctors = res.listDoctors;
            let arrDoctorId = [];
            if (listDoctors && listDoctors.length > 0) {
              listDoctors.map((item) => {
                arrDoctorId.push(item.doctorId);
              });
            }

            setDataDetailSpecialty(res.data);
            setArrDoctorId(arrDoctorId);
          }

          // Get select location
          let locations = await getAllCodeService("PROVINCE");
          console.log("PROVINCE", locations);
          if (locations && locations.data && locations.data.length > 0) {
            locations.data.unshift({
              keyMap: "ALL",
              type: "PROVINCE",
              valueEN: "Nationally",
              valueVI: "Toàn quốc",
            });
            setArrLocations(locations.data);
          }
        }
      } catch (error) {
        console.error("Error fetching specialty data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialtyData();
  }, [props.match]);

  const toggleExpand = () => {
    setExpanded(prevState => !prevState);
  };

  const handleOnChangeSelect = async (event) => {
    try {
      if (
        props.match &&
        props.match.params &&
        props.match.params.id
      ) {
        let location = event.target.value;
        // Get details specialty
        let id = props.match.params.id;
        let res = await getDetailSpecialtyById({
          id,
          location: location,
        });
        console.log("on change select", res, location);
        if (res && res.errCode === 0) {
          let listDoctors = res.listDoctors;
          let arrDoctorId = [];
          if (listDoctors && listDoctors.length > 0) {
            listDoctors.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }

          setDataDetailSpecialty(res.data);
          setArrDoctorId(arrDoctorId);
        }
      }
    } catch (error) {
      console.error("Error changing location:", error);
    }
  };

  const { language } = props;
  let specialityImage = "";
  console.log("details: ", { arrDoctorId, dataDetailSpecialty, arrLocations });
  if (dataDetailSpecialty.image) {
    specialityImage = Buffer.from(
      dataDetailSpecialty.image,
      "base64"
    ).toString("binary");
  }

  // Check if dataDetailSpecialty and descriptionHTML exist
  const contentToShow =
    dataDetailSpecialty && dataDetailSpecialty.descriptionHTML
      ? expanded
        ? dataDetailSpecialty.descriptionHTML
        : dataDetailSpecialty.descriptionHTML.slice(
            0,
            Math.floor(dataDetailSpecialty.descriptionHTML.length * 0.4)
          )
      : "";

  if (loading) {
    return (
      <>
        <HomeHeader />
        <div className="detail-specialty-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HomeHeader />
      <div className="detail-specialty-container">
        <div
          className="detail-specialty-header"
          style={{
            backgroundImage: `url(${specialityImage})`,
          }}
        >
          <div className="detail-specialty-header-content">
            {dataDetailSpecialty &&
              dataDetailSpecialty.descriptionMarkdown &&
              dataDetailSpecialty.descriptionHTML && (
                <div className="container">
                  <div dangerouslySetInnerHTML={{ __html: contentToShow }} />
                  {dataDetailSpecialty.descriptionHTML && 
                   dataDetailSpecialty.descriptionHTML.length > 200 && (
                    <>
                      {!expanded && (
                        <span
                          className="btn-show-hide"
                          onClick={toggleExpand}
                        >
                          Xem thêm
                        </span>
                      )}
                      {expanded && (
                        <span
                          className="btn-show-hide"
                          onClick={toggleExpand}
                        >
                          Thu gọn
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}
          </div>
        </div>
        
        
        
        <div className="detail-specialty-body">
          <div className="container">
            <div className="select-location">
          {/* <div className="container"> */}
            <select
              onChange={handleOnChangeSelect}
              className="select-location-btn"
            >
              {arrLocations &&
                arrLocations.length > 0 &&
                arrLocations.map((item, index) => {
                  let labelVi = language === LANGUAGES.VI ? item.valueVI : "";
                  let labelEn = language === LANGUAGES.EN ? item.valueEN : "";

                  return (
                    <option key={index} value={item.keyMap}>
                      {language === LANGUAGES.VI ? labelVi : labelEn}
                    </option>
                  );
                })}
            </select>
          {/* </div> */}
        </div>
            {arrDoctorId &&
              arrDoctorId.length > 0 &&
              arrDoctorId.map((doctorId) => (
                <div key={doctorId} className="detail-doctor">
                  <div className="doctor-profile-section">
                    <ProfileDoctor
                      doctorId={doctorId}
                      isShowDescription={true}
                    />
                  </div>

                  <div className="doctor-schedule-section">
                    <div className="doctor-info-grid">
                      <DoctorSchedule doctorId={doctorId ? doctorId : -1} />
                      <div className="doctor-extra-infor-wrapper">
                        <DoctorExtraInfor doctorId={doctorId ? doctorId : -1} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
