import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import './HeaderLogo.scss';

const HeaderLogo = () => {
    const history = useHistory();

    const handleLogoClick = () => {
        history.push('/home');
    };

    return (
        <div className="col-3 header-logo-section">
            <div className="nav-left" onClick={handleLogoClick}>
                <div className="header-logo"></div>
                <div className="brand-info">
                    <span className="brand-name">
                        <FormattedMessage id="header.brand-name" />
                    </span>
                    <span className="brand-slogan">
                        <FormattedMessage id="header.brand-slogan" />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HeaderLogo;