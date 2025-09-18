import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import "./Search.scss";

const Search = ({
  placeholder = "search.placeholder",
  value = "",
  onChange,
  onClear,
  className = "",
  label = "search.label",
  showLabel = true,
  size = "medium", // small, medium, large
  variant = "default", // default, outlined, filled
  disabled = false,
  autoFocus = false,
  clearable = true,
  icon = "fas fa-search"
}) => {
  const intl = useIntl();

  const handleSearchChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape' && clearable && value) {
      handleClear();
    }
  };

  return (
    <div className={`search-component ${size} ${variant} ${className} ${disabled ? 'disabled' : ''}`}>
      {showLabel && (
        <label className="search-label">
          <FormattedMessage id={label} defaultMessage="Tìm kiếm" />
        </label>
      )}
      
      <div className="search-input-wrapper">
        <i className={`${icon} search-icon`}></i>
        <input
          type="text"
          className="search-input"
          placeholder={intl.formatMessage({ 
            id: placeholder, 
            defaultMessage: "Nhập từ khóa tìm kiếm..." 
          })}
          value={value}
          onChange={handleSearchChange}
          onKeyDown={handleKeyPress}
          disabled={disabled}
          autoFocus={autoFocus}
        />
        {clearable && value && (
          <button 
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Xóa tìm kiếm"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;