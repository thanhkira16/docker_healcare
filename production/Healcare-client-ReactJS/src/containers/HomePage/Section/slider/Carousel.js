import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../scss/Carousel.scss";

/**
 * A reusable Carousel component that can display slides with customizable settings
 * @prop {Array} slides - Array of slide data to be rendered
 * @prop {Object} settings - Custom slider settings to override defaults
 * @prop {String} title - Carousel title
 * @prop {Function} renderItem - Custom function to render each slide item
 * @prop {String} containerClass - Additional class for the container
 * @prop {Object} containerStyle - Custom styles for the container
 */
class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slides: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.slides !== this.props.slides) {
      this.setState({ slides: this.props.slides });
    }
  }

  componentDidMount() {
    if (this.props.slides && this.props.slides.length > 0) {
      this.setState({ slides: this.props.slides });
    }
  }

  render() {
    // Default settings that can be overridden by props.settings
    const defaultSettings = {
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

    // Merge default settings with custom settings from props
    const settings = { ...defaultSettings, ...this.props.settings };
    const { slides } = this.state;
    const {
      title,
      renderItem,
      containerClass,
      containerStyle
    } = this.props;

    return (
      <div
        className={`carousel-container ${containerClass || ''}`}
        style={containerStyle}
      >
        {title && <h2 className="carousel-title">{title}</h2>}
        <Slider {...settings}>
          {slides.map((slide, index) => {
            // If a custom render function is provided, use it
            if (renderItem) {
              return <div key={index}>{renderItem(slide, index)}</div>;
            }
            // Default rendering of slides
            return (
              <div key={index} className="carousel-slide">
                {slide.img && (
                  <div
                    className="carousel-image"
                    style={{ backgroundImage: `url(${slide.img})` }}
                  ></div>
                )}
                {slide.mainTitle && (
                  <h5 className="carousel-item-title">{slide.mainTitle}</h5>
                )}
              </div>
            );
          })}
        </Slider>
      </div>
    );
  }
}

export default Carousel;
