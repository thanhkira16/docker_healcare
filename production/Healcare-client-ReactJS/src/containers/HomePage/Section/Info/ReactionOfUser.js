import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

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
        },
        {
          id: 4,
          name: "Phạm Văn Đức",
          rating: 5,
          comment: "Đội ngũ y tế chuyên nghiệp, hỗ trợ nhiệt tình.",
          service: "Khám nội tổng quát",
          date: "12/09/2025"
        },
        {
          id: 5,
          name: "Hoàng Thị Mai",
          rating: 5,
          comment: "Ứng dụng dễ sử dụng, bác sĩ tư vấn kỹ lưỡng.",
          service: "Tư vấn dinh dưỡng",
          date: "11/09/2025"
        },
        {
          id: 6,
          name: "Vũ Văn Nam",
          rating: 4,
          comment: "Dịch vụ ổn, thời gian chờ hợp lý.",
          service: "Khám mắt",
          date: "10/09/2025"
        },
        {
          id: 7,
          name: "Đỗ Thị Linh",
          rating: 5,
          comment: "Rất hài lòng với dịch vụ khám online này.",
          service: "Tư vấn phụ khoa",
          date: "09/09/2025"
        }
      ]
    };
  }

  renderStars(rating) {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        style={{
          color: index < rating ? 'var(--bs-warning)' : 'var(--border-color)',
          fontSize: '1.6rem',
          marginRight: '2px'
        }}
      >
        ★
      </span>
    ));
  }

  render() {
    const { reviews } = this.state;
    const duplicatedReviews = [...reviews, ...reviews]; // Duplicate for infinite scroll

    return (
      <div className="container" style={{ padding: '60px 15px !important' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{
            fontSize: 'var(--font-size-3xl)',
            color: 'var(--bs-primary)',
            fontWeight: '600',
            marginBottom: '10px'
          }}>
            <FormattedMessage id="reviews.title" defaultMessage="Đánh Giá Của Khách Hàng" />
          </h2>
          <p style={{
            fontSize: 'var(--font-size-md)',
            color: 'var(--black-medium-color)',
            marginBottom: '0'
          }}>
            <FormattedMessage id="reviews.subtitle" defaultMessage="Những chia sẻ chân thật từ bệnh nhân đã sử dụng dịch vụ" />
          </p>
        </div>

        <div style={{
          background: 'white',
          height: '180px',
          margin: 'auto',
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          {/* Gradient overlays */}
          <div style={{
            background: 'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)',
            content: '""',
            height: '180px',
            position: 'absolute',
            width: '100px',
            zIndex: 2,
            left: 0,
            top: 0
          }} />

          <div style={{
            background: 'linear-gradient(to left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)',
            content: '""',
            height: '180px',
            position: 'absolute',
            width: '100px',
            zIndex: 2,
            right: 0,
            top: 0
          }} />

          <div style={{
            animation: 'scroll 50s linear infinite',
            display: 'flex',
            width: `calc(350px * ${duplicatedReviews.length})`
          }}>
            {duplicatedReviews.map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                style={{
                  height: '180px',
                  width: '350px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{
                  background: 'var(--bs-light)',
                  borderRadius: '12px',
                  padding: '20px',
                  height: '100%',
                  border: '1px solid var(--border-color-light)',
                  position: 'relative'
                }}>
                  {/* User info */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: '600',
                        color: 'var(--bs-primary)',
                        margin: '0 0 4px 0'
                      }}>
                        {review.name}
                      </h4>
                      <div>{this.renderStars(review.rating)}</div>
                    </div>
                  </div>

                  {/* Comment */}
                  <p style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--black-color)',
                    margin: '0 0 12px 0',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    "{review.comment}"
                  </p>

                  {/* Service and date */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto'
                  }}>
                    <span style={{
                      fontSize: 'var(--font-size-2xs)',
                      color: 'var(--bs-info)',
                      background: 'rgba(13, 175, 202, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      {review.service}
                    </span>
                    <span style={{
                      fontSize: 'var(--font-size-2xs)',
                      color: 'var(--black-medium-color)'
                    }}>
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '40px',
          gap: '40px',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--font-size-huge)',
              fontWeight: '700',
              color: 'var(--bs-success)',
              marginBottom: '5px'
            }}>
              4.8
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--black-medium-color)' }}>
              <FormattedMessage id="reviews.stats.average" defaultMessage="Đánh giá trung bình" />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--font-size-huge)',
              fontWeight: '700',
              color: 'var(--bs-primary)',
              marginBottom: '5px'
            }}>
              2,847
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--black-medium-color)' }}>
              <FormattedMessage id="reviews.stats.total" defaultMessage="Lượt đánh giá" />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--font-size-huge)',
              fontWeight: '700',
              color: 'var(--bs-info)',
              marginBottom: '5px'
            }}>
              98%
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--black-medium-color)' }}>
              <FormattedMessage id="reviews.stats.satisfaction" defaultMessage="Khách hàng hài lòng" />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-350px * 7)); }
          }
        `}</style>
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