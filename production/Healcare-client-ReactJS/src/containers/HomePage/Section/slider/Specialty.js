import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { FormattedMessage } from "react-intl";
import { getAllSpecialties } from "../../../../services/userService";
import Carousel from "./Carousel";
import CarouselHeader from "./CarouselHeader";
import "../scss/Carousel.scss";

class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSpecialty: [],
      slides: [],
    };
  }

  async componentDidMount() {
    try {
      const res = await getAllSpecialties();
      if (res.errCode === 0) {
        this.setState({ dataSpecialty: res.data ? res.data : [] });
      } else {
        console.error("Failed to get all specialty");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.language !== this.props.language) {
      this.assignDataOfCarousel();
    }
    if (prevState.dataSpecialty !== this.state.dataSpecialty) {
      this.assignDataOfCarousel();
    }
  }

  handleViewDetailSpecialty = (specialtyId) => {
    this.props.history.push(`/detail-specialty/${specialtyId}`);
  }

  assignDataOfCarousel() {
    const { dataSpecialty } = this.state;
    const { language } = this.props;
    let slides = [];

    if (dataSpecialty && dataSpecialty.length > 0) {
      dataSpecialty.forEach((item) => {
        let slide = {
          img: item.image,
          mainTitle: item.name,
          specialtyId: item.id,
        };

        slides.push(slide);
      });
      this.setState({
        slides: slides,
      });
    }
  }

  renderSpecialtyItem = (slide, index) => {
    return (
      <div className="carousel-slide" onClick={() => this.handleViewDetailSpecialty(slide.specialtyId)}>
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
          <CarouselHeader
            titleId="home-page.speciality-popularity"
            defaultTitle="Specialty"
            onSeeMore={() => this.props.history.push('/specialties')}
          />

          <Carousel
            slides={slides}
            settings={settings}
            containerClass="specialty-carousel"
            renderItem={this.renderSpecialtyItem}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Specialty)
);