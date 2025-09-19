import React from 'react';
import './StatCard.scss';

const StatCard = ({ icon: Icon, title, value, trend, color }) => (
  <div className="stat-card">
    <div className="stat-card__icon" style={{ backgroundColor: color }}>
      <Icon size={24} color="white" />
    </div>
    <div className="stat-card__content">
      <h3 className="stat-card__title">{title}</h3>
      <p className="stat-card__value">{value}</p>
      {trend && (
        <span className={`stat-card__trend ${trend > 0 ? 'positive' : 'negative'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
  </div>
);

export default StatCard;