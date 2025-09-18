import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { FormattedMessage } from "react-intl";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import Carousel from "./Carousel";
import CarouselHeader from "./CarouselHeader";
import "../scss/Carousel.scss";

class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
      dataSpecialty: [],
      slides: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.language !== this.props.language) {
      this.assignDataOfCarousel();
    }
    if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
      this.setState({
        arrDoctors: this.props.topDoctorsRedux,
      });
    }
    if (prevState.arrDoctors !== this.state.arrDoctors) {
      this.assignDataOfCarousel(this.state.arrDoctors);
    }
  }

  async componentDidMount() {
    this.props.loadTopDoctors();
  }

  handleViewDetailDoctor = (doctorId) => {
    this.props.history.push(`/detail-doctor/${doctorId}`);
  }

  assignDataOfCarousel() {
    const { arrDoctors, dataSpecialty } = this.state;
    const { language } = this.props;
    let slides = [];

    if (arrDoctors && arrDoctors.length > 0) {
      arrDoctors.forEach((item) => {
        let imgBase64 = "";
        if (item.image) {
          imgBase64 = Buffer.from(item.image, "base64").toString("binary");
        }

        let nameVi = `${item.positionData.valueVi}, ${item.firstName} ${item.lastName}`;
        let nameEn = `${item.positionData.valueEn}, ${item.lastName} ${item.firstName}`;
        let specialtyId = item.Doctor_Infor?.specialtyId;
        let specialtyName = item.Doctor_Infor?.specialtyTypeData?.name || '';

        // Create a new slide object for each iteration
        let slide = {
          img: imgBase64,
          mainTitle: language === LANGUAGES.VI ? nameVi : nameEn,
          doctorId: item.id,
          specialtyId: specialtyId,
          specialtyName: specialtyName
        };

        slides.push(slide);
      });

      this.setState({
        slides: slides,
      });
    }
  }

  renderDoctorItem = (slide, index) => {
    return (
      <div className="carousel-slide doctor-item" onClick={() => this.handleViewDetailDoctor(slide.doctorId)}>
        <div
          className="carousel-image"
          style={{
            backgroundImage: `url(${slide.img})`,
            borderRadius: '50%',
            width: '100px',
            height: '100px',
            margin: '0 auto'
          }}
        ></div>
        <div className="doctor-info">
          <h5 className="carousel-item-title">{slide.mainTitle}</h5>
          {slide.specialtyName && <small className="specialty-name">{slide.specialtyName}</small>}
        </div>
        <div className="appointment-btn-container">
          <button className="btn-appointment">
            <FormattedMessage id="home-page.book-appointment" defaultMessage="Book Appointment" />
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { language } = this.props;
    const { slides } = this.state;

    // Slider settings
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };

    return (
      <div className="container-fluid">
        <div className="container">
          <CarouselHeader
            titleId="home-page.out-standings-doctor"
            defaultTitle="Outstanding Doctors"
            onSeeMore={() => this.props.history.push('/doctors')}
          />

          <Carousel
            slides={slides}
            settings={settings}
            containerClass="doctor-carousel"
            renderItem={this.renderDoctorItem}
            containerStyle={{ backgroundColor: 'var(--bs-white)' }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    topDoctorsRedux: state.admin.topDoctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);