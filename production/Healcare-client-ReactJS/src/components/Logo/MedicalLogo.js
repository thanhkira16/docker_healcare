import React from 'react';
import PropTypes from 'prop-types';
import './MedicalLogo.scss';

const MedicalLogo = ({ size = 50, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className={`medical-logo ${className}`}
        >
            {/* Heart */}
            <path
                d="M100 75 C120 45 160 45 160 85 C160 125 100 150 100 150 C100 150 40 125 40 85 C40 45 80 45 100 75Z"
                fill="var(--bs-info)"
            />

            {/* Left Hand */}
            <path
                d="M45 120 C25 100 35 85 50 95 C65 105 70 115 75 125 C65 122 55 125 45 120"
                fill="var(--bs-info)"
                opacity="0.9"
            />

            {/* Right Hand */}
            <path
                d="M155 120 C175 100 165 85 150 95 C135 105 130 115 125 125 C135 122 145 125 155 120"
                fill="var(--bs-info)"
                opacity="0.9"
            />
        </svg>
    );
};

MedicalLogo.propTypes = {
    size: PropTypes.number,
    className: PropTypes.string,
};

export default MedicalLogo;