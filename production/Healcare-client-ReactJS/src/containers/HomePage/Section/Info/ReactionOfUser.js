import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import '../scss/ReactionOfUser.scss';

class ReactionOfUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [
        {
          id: 1,
          name: <FormattedMessage id="reviews.user1.name" defaultMessage="Nguyễn Thị Lan" />,
          rating: 5,
          comment: <FormattedMessage id="reviews.user1.comment" defaultMessage="Dịch vụ tuyệt vời! Bác sĩ rất tận tâm và chuyên nghiệp." />,
          service: <FormattedMessage id="reviews.user1.service" defaultMessage="Tư vấn tim mạch" />,
          date: "15/09/2025"
        },
        {
          id: 2,
          name: <FormattedMessage id="reviews.user2.name" defaultMessage="Trần Văn Minh" />,
          rating: 5,
          comment: <FormattedMessage id="reviews.user2.comment" defaultMessage="Tiện lợi, nhanh chóng. Được tư vấn chi tiết từ xa." />,
          service: <FormattedMessage id="reviews.user2.service" defaultMessage="Khám nhi khoa" />,
          date: "14/09/2025"
        },
        {
          id: 3,
          name: "Lê Thị Hoa",
          rating: 4,
          comment: "Chất lượng dịch vụ tốt, giá cả hợp lý.",
          service: "Tư vấn da liễu",
          date: "13/09/2025"
        }
      ]
    };
  }

  renderStars(rating) {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'star--filled' : 'star--empty'}`}
      >
        ★
      </span>
    ));
  }

  render() {
    const { reviews } = this.state;

    return (
      <div className="container reaction-of-user">
        <div className="">
          <div className="reaction-of-user__header">
            <h2 className="reaction-of-user__header-title">
              <FormattedMessage id="reviews.title" defaultMessage="Đánh Giá Của Khách Hàng" />
            </h2>
            <p className="reaction-of-user__header-subtitle">
              <FormattedMessage id="reviews.subtitle" defaultMessage="Những chia sẻ chân thật từ bệnh nhân đã sử dụng dịch vụ" />
            </p>
          </div>

          <div className="reaction-of-user__content">
            <div className="reaction-of-user__slider">
              <div className="reaction-of-user__slider-track">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="reaction-of-user__slider-item"
                  >
                    <div className="reaction-of-user__review">
                      {/* User info */}
                      <div className="reaction-of-user__review-header">
                        <div>
                          <h4 className="reaction-of-user__review-user-name">
                            {review.name}
                          </h4>
                          <div className="reaction-of-user__review-user-stars">
                            {this.renderStars(review.rating)}
                          </div>
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="reaction-of-user__review-comment">
                        {review.comment}
                      </p>

                      {/* Service and date */}
                      <div className="reaction-of-user__review-footer">
                        <span className="reaction-of-user__review-service">
                          {review.service}
                        </span>
                        <span className="reaction-of-user__review-date">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="reaction-of-user__statistics">
              <div className="reaction-of-user__statistics-item">
                <div className="reaction-of-user__statistics-item-number reaction-of-user__statistics-item-number--success">
                  4.8
                </div>
                <div className="reaction-of-user__statistics-item-label">
                  <FormattedMessage id="reviews.stats.average" defaultMessage="Đánh giá trung bình" />
                </div>
              </div>
              <div className="reaction-of-user__statistics-item">
                <div className="reaction-of-user__statistics-item-number reaction-of-user__statistics-item-number--primary">
                  2,847
                </div>
                <div className="reaction-of-user__statistics-item-label">
                  <FormattedMessage id="reviews.stats.total" defaultMessage="Lượt đánh giá" />
                </div>
              </div>
              <div className="reaction-of-user__statistics-item">
                <div className="reaction-of-user__statistics-item-number reaction-of-user__statistics-item-number--info">
                  98%
                </div>
                <div className="reaction-of-user__statistics-item-label">
                  <FormattedMessage id="reviews.stats.satisfaction" defaultMessage="Khách hàng hài lòng" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReactionOfUser);