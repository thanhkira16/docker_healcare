import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom"; // Optional, if routing is needed
import { history } from "../../redux"; // Mimicking App.js's history import
import HomeHeader from "./HomeHeader";
import Banner from "./Section/Banner";
import Specialty from "./Section/slider/Specialty";
import MedicalFacility from "./Section/slider/MedicalFacility";
import OutStandingDoctor from "./Section/slider/OutStandingDoctor";
import Footer from "./Section/Info/Footer";
import ReactionOfUser from "./Section/Info/ReactionOfUser";
import About from "./Section/About";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/common.scss";
import "../../styles/Base.scss";
import "../../styles/_form.scss"; // Adjusted to match form.scss from App.scss
import "../../styles/_variables.scss"; // Adjusted to match variables.scss from App.scss
import "../../styles/_base.scss";
import "./HomePage.scss";

class HomePage extends Component {
  componentDidMount() {
    document.title = "VKU Healcare - Nền tảng y tế sức khỏe toàn diện";
  }

  render() {
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 3,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
      ],
    };

    return (
      <Fragment>
        <HomeHeader />
        <Banner />
        <ReactionOfUser />
        <div id="specialties">
          <Specialty settings={settings} />
        </div>
        <div id="facilities">
          <MedicalFacility settings={settings} />
        </div>
        <div id="doctors">
          <OutStandingDoctor settings={settings} />
        </div>
        <div id="about">
          <About />
        </div>
        <Footer />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);