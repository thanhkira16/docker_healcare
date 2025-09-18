import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import MedicalLogo from '../../components/Logo/MedicalLogo'; 
import './HeaderLogo.scss';


const HeaderLogo = () => {
    const history = useHistory();

    const handleLogoClick = () => {
        history.push('/home');
    };

    const handleKeyPress = (e) => {
        // Handle Enter and Space key for accessibility
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleLogoClick();
        }
    };

    return (
        <div className="header-logo-section">
            <div 
                className="nav-left" 
                onClick={handleLogoClick}
                onKeyPress={handleKeyPress}
                role="button"
                tabIndex={0}
                aria-label="Go to homepage"
            >
                <div className="header-logo-container">
                    <MedicalLogo size={50} className="header-svg-logo" />
                </div>
                
                <div className="brand-info">
                    <span className="brand-name">
                        <FormattedMessage 
                            id="header.brand-name" 
                            defaultMessage="BookingCare" 
                        />
                    </span>
                    <span className="brand-slogan">
                        <FormattedMessage 
                            id="header.brand-slogan" 
                            defaultMessage="Chăm sóc sức khỏe toàn diện" 
                        />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HeaderLogo;