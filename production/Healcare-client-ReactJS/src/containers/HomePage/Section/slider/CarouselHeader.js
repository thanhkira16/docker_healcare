import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import "../scss/CarouselHeader.scss";

const CarouselHeader = ({ 
    titleId, 
    defaultTitle, 
    onSeeMore, 
    loading = false,
    seeMoreText = null,
    showSeeMore = true,
    className = "",
    titleClassName = "",
    buttonClassName = ""
}) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleSeeMoreClick = async (e) => {
        e.preventDefault();
        if (loading || !onSeeMore) return;

        setIsClicked(true);
        
        try {
            await onSeeMore();
        } finally {
            // Reset click state after animation
            setTimeout(() => setIsClicked(false), 150);
        }
    };

    const headerClasses = `carousel-header ${loading ? 'loading' : ''} ${className}`.trim();
    const titleClasses = `header-title header-title-underline ${titleClassName}`.trim();
    const buttonClasses = `btn-see-more ${isClicked ? 'clicked' : ''} ${buttonClassName}`.trim();

    return (
        <div className={headerClasses}>
            <h2 className={titleClasses}>
                <FormattedMessage id={titleId} defaultMessage={defaultTitle} />
            </h2>
            
            {showSeeMore && (
                <button 
                    type="button"
                    className={buttonClasses}
                    onClick={handleSeeMoreClick}
                    disabled={loading}
                    aria-label="See more items"
                >
                    {loading ? (
                        <FormattedMessage id="common.loading" defaultMessage="Loading..." />
                    ) : (
                        <FormattedMessage 
                            id={seeMoreText || "home-page.btnSeeMore"} 
                            defaultMessage="See more" 
                        />
                    )}
                </button>
            )}
        </div>
    );
};

export default CarouselHeader;