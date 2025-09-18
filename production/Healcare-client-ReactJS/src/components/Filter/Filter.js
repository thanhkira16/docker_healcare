import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import "./Filter.scss";

const Filter = ({
  searchPlaceholder = "search.placeholder",
  searchValue = "",
  onSearchChange,
  filters = [],
  onFilterChange,
  onClear,
  className = ""
}) => {
  const [localFilters, setLocalFilters] = useState({});

  useEffect(() => {
    // Initialize local filters with default values
    const initialFilters = {};
    filters.forEach(filter => {
      initialFilters[filter.key] = filter.defaultValue || "";
    });
    setLocalFilters(initialFilters);
  }, [filters]);

  const handleSearchChange = (e) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = {
      ...localFilters,
      [filterKey]: value
    };
    setLocalFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(filterKey, value, newFilters);
    }
  };

  const handleClear = () => {
    const clearedFilters = {};
    filters.forEach(filter => {
      clearedFilters[filter.key] = "";
    });
    setLocalFilters(clearedFilters);
    
    if (onClear) {
      onClear();
    }
  };

  const renderFilterField = (filter) => {
    const { key, type, label, options, placeholder } = filter;
    const value = localFilters[key] || "";

    switch (type) {
      case "select":
        return (
          <div key={key} className="filter-field">
            <label className="filter-label">
              {typeof label === 'string' ? (
                <FormattedMessage id={label} defaultMessage={label} />
              ) : (
                label
              )}
            </label>
            <select
              className="filter-select"
              value={value}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            >
              {options && options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label && typeof option.label === 'string' ? option.label : String(option.label || option.value || 'Không xác định')}
                </option>
              ))}
            </select>
          </div>
        );

      case "input":
        return (
          <div key={key} className="filter-field">
            <label className="filter-label">
              {typeof label === 'string' ? (
                <FormattedMessage id={label} defaultMessage={label} />
              ) : (
                label
              )}
            </label>
            <input
              type="text"
              className="filter-input"
              value={value}
              placeholder={placeholder}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            />
          </div>
        );

      case "date":
        return (
          <div key={key} className="filter-field">
            <label className="filter-label">
              {typeof label === 'string' ? (
                <FormattedMessage id={label} defaultMessage={label} />
              ) : (
                label
              )}
            </label>
            <input
              type="date"
              className="filter-input"
              value={value}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`filter-container ${className}`}>
      <div className="filter-content">
        <div className="filter-search">
          <div className="search-field">
            <label className="filter-label">Tìm kiếm</label>
            <div className="search-input-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        {filters && filters.length > 0 && (
          <div className="filter-fields">
            {filters.map(filter => renderFilterField(filter))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;