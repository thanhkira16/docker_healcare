import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import "./SpecialtyCard.scss";

const SpecialtyCard = (props) => {
    const handleViewDetailSpecialty = (specialtyId) => {
        if (props.history && specialtyId) {
            props.history.push(`/detail-specialty/${specialtyId}`);
        }
    };

    const { specialty } = props;
    const imgDivStyle = {
        backgroundImage: specialty && specialty.image
            ? `url(${specialty.image})`
            : "none",
    };

    return (
        <div
            className="specialty-card"
            onClick={() => handleViewDetailSpecialty(specialty.id)}
        >
            <div className="avt-specialty" style={imgDivStyle}></div>
            <div className="specialty-info text-center">
                <h3 className="specialty-title">
                    {specialty && specialty.name ? specialty.name : "Specialty Name"}
                </h3>
            </div>
        </div>
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

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SpecialtyCard)
);
