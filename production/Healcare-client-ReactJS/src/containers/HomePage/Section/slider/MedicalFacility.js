import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { FormattedMessage } from "react-intl";
import { getAllClinics } from "../../../../services/userService";
import Carousel from "./Carousel";
import "../scss/Carousel.scss";

class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataClinic: [],
      slides: [],
    };
  }

  async componentDidMount() {
    try {
      const res = await getAllClinics();

      if (res.errCode === 0) {
        this.setState({ dataClinic: res.data ? res.data : [] });
      } else {
        console.error("Failed to get all clinic");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  handleViewDetailClinic = (clinicId) => {
    this.props.history.push(`/detail-clinic/${clinicId}`);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.language !== this.props.language) {
      this.assignDataOfCarousel();
    }
    if (prevState.dataClinic !== this.state.dataClinic) {
      this.assignDataOfCarousel();
    }
  }

  assignDataOfCarousel() {
    const { dataClinic } = this.state;
    const { language } = this.props;
    let slides = [];

    if (dataClinic && dataClinic.length > 0) {
      dataClinic.forEach((item) => {
        let slide = {
          img: item.image,
          mainTitle: item.name,
          clinicId: item.id,
        };

        slides.push(slide);
      });
      this.setState({
        slides: slides,
      });
    }
  }

  renderClinicItem = (slide, index) => {
    return (
      <div className="carousel-slide" onClick={() => this.handleViewDetailClinic(slide.clinicId)}>
        <div
          className="carousel-image"
          style={{
            backgroundImage: `url(${slide.img})`,
          }}
        ></div>
        <h5 className="carousel-item-title">{slide.mainTitle}</h5>
      </div>
    );
  }

  render() {
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
          <div className="carousel-header">
            <span className="header-title header-title-underline">
              <FormattedMessage id="home-page.medical-popularity" />
            </span>
            <span className="btn-see-more">
              <FormattedMessage
                id="home-page.btnSeeMore"
                defaultMessage="See more"
              />
            </span>
          </div>

          <Carousel
            slides={slides}
            settings={settings}
            containerClass="medical-carousel"
            renderItem={this.renderClinicItem}
            containerStyle={{ backgroundColor: 'var(--blue-medium-color)' }}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);