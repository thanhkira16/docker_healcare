import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllSpecialties } from '../../../services/userService';
import './Banner.scss';

class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: [],
            fullname: '',
            phone: '',
            department: '',
            description: ''
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

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted with state:", this.state);
    };

    render() {
        const { dataSpecialty, fullname, phone, department, description } = this.state;
        const { language } = this.props;

        return (
            <div className="banner row d-flex flex-wrap flex-lg-nowrap flex-md-wrap">
                <div className="banner-left mt-md-5 mb-lg-5 text-md-start text-center col-md-5 col-12 col-sm-12 col-lg-6">
                    <div className="register">
                        <strong className="register-title">
                            <FormattedMessage id="homeheader.register" />
                        </strong>
                        <form onSubmit={this.handleSubmit}>
                            <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                value={fullname}
                                onChange={this.handleChange}
                                placeholder="Fullname"
                                required
                            />
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                pattern="[0-9]{10,11}"
                                value={phone}
                                onChange={this.handleChange}
                                placeholder="Phone number"
                                required
                            />
                            <select
                                id="department"
                                name="department"
                                value={department}
                                onChange={this.handleChange}
                                required
                            >
                                <option value="">Select specialty</option>
                                {dataSpecialty.map(specialty => (
                                    <option key={specialty.id} value={specialty.name}>
                                        {specialty.name}
                                    </option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Description..."
                                id="description"
                                name="description"
                                value={description}
                                onChange={this.handleChange}
                                required
                            />
                            <input type="submit" value={language === "en" ? "Submit" : "Gửi đăng ký"} />
                        </form>
                    </div>
                </div>
                <div className="banner-right col-12 col-md-5 col-sm-12 col-lg-6 text-center mx-auto mx-sm-0">
                    <div className="banner-title">
                        <h3 className="main-title">
                            <FormattedMessage id="banner.main-title" />
                        </h3>
                        <h2 className="sub-title">
                            <FormattedMessage id="banner.sub-title" />
                        </h2>
                        <p className="desc">
                            <FormattedMessage id="banner.desc" />
                        </p>
                    </div>
                    <div className="banner-right-background"></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
});

export default connect(mapStateToProps)(Banner);