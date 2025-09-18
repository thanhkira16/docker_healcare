import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import './Banner.scss';

class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: ''
        };
    }

    handleSearchChange = (e) => {
        this.setState({
            searchTerm: e.target.value
        });
    };

    handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Search submitted:", this.state.searchTerm);
    };

    render() {
        const { searchTerm } = this.state;
        const { intl } = this.props;

        return (
            <div className="banner-container">
                <div className="banner-content">
                    {/* Main Title */}
                    <div className="banner-header">
                        <h1 className="banner-title">
                            <FormattedMessage id="banner.platform-title" />
                        </h1>
                    </div>

                    {/* Search Section */}
                    <div className="banner-search">
                        <form className="search-form" onSubmit={this.handleSearchSubmit}>
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={this.handleSearchChange}
                                    placeholder={intl.formatMessage({ id: 'banner.search-placeholder' })}
                                />
                                <button type="submit" className="search-btn">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* AI Support Section */}
                    <div className="ai-support-section">
                        <h2 className="ai-title">
                            <FormattedMessage id="banner.ai-support" />
                        </h2>

                        <div className="ai-services">
                            <div className="ai-service-item">
                                <div className="service-icon">
                                    <i className="fas fa-calendar-alt"></i>
                                </div>
                                <div className="service-content">
                                    <h3 className="service-title">
                                        <FormattedMessage id="banner.appointment-booking" />
                                    </h3>
                                    <p className="service-description">
                                        <FormattedMessage id="banner.appointment-desc" />
                                    </p>
                                </div>
                            </div>

                            <div className="ai-service-item">
                                <div className="service-icon">
                                    <i className="fas fa-user-md"></i>
                                </div>
                                <div className="service-content">
                                    <h3 className="service-title">
                                        <FormattedMessage id="banner.beauty-assistant" />
                                    </h3>
                                    <p className="service-description">
                                        <FormattedMessage id="banner.beauty-desc" />
                                    </p>
                                </div>
                            </div>

                            <div className="ai-service-item">
                                <div className="service-icon">
                                   <i className="fas fa-stethoscope"></i>
                                </div>
                                <div className="service-content">
                                    <h3 className="service-title">
                                        <FormattedMessage id="banner.dental-assistant" />
                                    </h3>
                                    <p className="service-description">
                                        <FormattedMessage id="banner.dental-desc" />
                                    </p>
                                </div>
                            </div>

                            <div className="ai-service-item">
                                <div className="service-icon">
                                    <i className="fas fa-pills"></i>
                                </div>
                                <div className="service-content">
                                    <h3 className="service-title">
                                        <FormattedMessage id="banner.acne-assistant" />
                                    </h3>
                                    <p className="service-description">
                                        <FormattedMessage id="banner.acne-desc" />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
});

// Wrap the component with both connect and injectIntl
export default connect(mapStateToProps)(injectIntl(Banner));