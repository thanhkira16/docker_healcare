import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { FormattedMessage } from 'react-intl';
import { 
  CalendarCheck, 
  DollarSign,
  TrendingUp,
  Users,
  Heart,
  UserCheck,
  ClipboardList,
  Activity,
  Calendar,
  Filter
} from 'lucide-react';
import { StatCard } from '../../../../components/Dashboard';
import './Dashboard.scss';

// Time Filter Component
const TimeFilter = ({ selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
  const currentYear = new Date().getFullYear();
  const months = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' }
  ];

  const years = [];
  for (let year = currentYear - 5; year <= currentYear + 1; year++) {
    years.push({ value: year, label: `${year}` });
  }

  return (
    <div className="time-filter">
      <div className="time-filter__header">
        <Calendar size={18} />
      </div>
      <div className="time-filter__selects">
        <div className="filter-select">
          <label htmlFor="month-select">Tháng:</label>
          <select 
            id="month-select"
            value={selectedMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            className="filter-select__input"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-select">
          <label htmlFor="year-select">Năm:</label>
          <select 
            id="year-select"
            value={selectedYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className="filter-select__input"
          >
            {years.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// Data functions based on month and year
const getAppointmentDataByPeriod = (month, year) => {
  // Simulate different data based on month/year selection
  const baseData = [
    { day: 'Tuần 1', bookings: Math.floor(Math.random() * 50) + 100, completed: Math.floor(Math.random() * 40) + 80 },
    { day: 'Tuần 2', bookings: Math.floor(Math.random() * 50) + 120, completed: Math.floor(Math.random() * 40) + 100 },
    { day: 'Tuần 3', bookings: Math.floor(Math.random() * 50) + 110, completed: Math.floor(Math.random() * 40) + 90 },
    { day: 'Tuần 4', bookings: Math.floor(Math.random() * 50) + 130, completed: Math.floor(Math.random() * 40) + 110 }
  ];
  
  // Add some variation based on month
  const monthMultiplier = month <= 6 ? 0.8 : 1.2;
  
  return baseData.map(item => ({
    ...item,
    bookings: Math.floor(item.bookings * monthMultiplier),
    completed: Math.floor(item.completed * monthMultiplier)
  }));
};

const getRevenueDataByPeriod = (month, year) => {
  const baseData = [
    { day: 'Tuần 1', revenue: Math.floor(Math.random() * 10000) + 50000 },
    { day: 'Tuần 2', revenue: Math.floor(Math.random() * 10000) + 60000 },
    { day: 'Tuần 3', revenue: Math.floor(Math.random() * 10000) + 55000 },
    { day: 'Tuần 4', revenue: Math.floor(Math.random() * 10000) + 65000 }
  ];
  
  const yearMultiplier = year >= 2024 ? 1.1 : 0.9;
  
  return baseData.map(item => ({
    ...item,
    revenue: Math.floor(item.revenue * yearMultiplier)
  }));
};

const getServiceTrendsDataByPeriod = (month, year) => {
  return [
    { name: 'Khám tổng quát', value: Math.floor(Math.random() * 20) + 30, fill: '#6366f1' },
    { name: 'Tim mạch', value: Math.floor(Math.random() * 15) + 20, fill: '#fbbf24' },
    { name: 'Nhi khoa', value: Math.floor(Math.random() * 15) + 25, fill: '#10b981' },
    { name: 'Da liễu', value: Math.floor(Math.random() * 10) + 15, fill: '#f59e0b' },
    { name: 'Khác', value: Math.floor(Math.random() * 10) + 10, fill: '#6b7280' }
  ];
};

const getUserActivityDataByPeriod = (month, year) => {
  const baseData = [
    { day: 'Tuần 1', patients: Math.floor(Math.random() * 50) + 200, doctors: Math.floor(Math.random() * 10) + 40 },
    { day: 'Tuần 2', patients: Math.floor(Math.random() * 50) + 220, doctors: Math.floor(Math.random() * 10) + 42 },
    { day: 'Tuần 3', patients: Math.floor(Math.random() * 50) + 210, doctors: Math.floor(Math.random() * 10) + 41 },
    { day: 'Tuần 4', patients: Math.floor(Math.random() * 50) + 230, doctors: Math.floor(Math.random() * 10) + 43 }
  ];
  
  return baseData;
};

const getStatsDataByPeriod = (month, year) => {
  const monthMultiplier = month <= 6 ? 0.8 : 1.2;
  const yearMultiplier = year >= 2024 ? 1.1 : 0.9;
  
  return [
    {
      icon: CalendarCheck,
      title: 'Lịch hẹn hôm nay',
      value: Math.floor((24 * monthMultiplier * yearMultiplier)).toString(),
      trend: '+12.5%',
      color: '#6366f1'
    },
    {
      icon: Users,
      title: 'Bệnh nhân mới',
      value: Math.floor((183 * monthMultiplier * yearMultiplier)).toString(),
      trend: '+8.3%',
      color: '#10b981'
    },
    {
      icon: DollarSign,
      title: 'Doanh thu tháng',
      value: (Math.floor((125000 * monthMultiplier * yearMultiplier) / 1000)).toString() + 'K',
      trend: '+15.2%',
      color: '#fbbf24'
    },
    {
      icon: TrendingUp,
      title: 'Tăng trưởng',
      value: (Math.floor((18.5 * monthMultiplier * yearMultiplier * 10)) / 10).toString() + '%',
      trend: '+3.1%',
      color: '#f59e0b'
    }
  ];
};


// Biểu đồ thống kê đặt lịch
const AppointmentStatsChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} barGap={8}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="bookings" fill="#6366f1" name="Đặt lịch" radius={[4,4,0,0]} />
        <Bar dataKey="completed" fill="#fbbf24" name="Hoàn thành" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Biểu đồ doanh thu
const RevenueChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip formatter={(value) => [new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ', 'Doanh thu']} />
        <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Biểu đồ xu hướng dịch vụ
const ServiceTrendsChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Biểu đồ hoạt động người dùng
const UserActivityChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="patients" stroke="#6366f1" name="Bệnh nhân" strokeWidth={2} />
        <Line type="monotone" dataKey="doctors" stroke="#fbbf24" name="Bác sĩ" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};
const Dashboard = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [appointmentData, setAppointmentData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [serviceTrendsData, setServiceTrendsData] = useState([]);
  const [userActivityData, setUserActivityData] = useState([]);
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    // Update data when month or year changes
    setAppointmentData(getAppointmentDataByPeriod(selectedMonth, selectedYear));
    setRevenueData(getRevenueDataByPeriod(selectedMonth, selectedYear));
    setServiceTrendsData(getServiceTrendsDataByPeriod(selectedMonth, selectedYear));
    setUserActivityData(getUserActivityDataByPeriod(selectedMonth, selectedYear));
    setStatsData(getStatsDataByPeriod(selectedMonth, selectedYear));
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard__header">
        <div className="dashboard__title-section">
          <h1 className="dashboard__title">
            <FormattedMessage id="system.dashboard.title" defaultMessage="Dashboard - Báo cáo & Thống kê" />
          </h1>
        </div>
        <TimeFilter 
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
        />
      </div>

      {/* Stats Cards */}
      <div className="dashboard__stats">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            color={stat.color}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="dashboard__charts">
        {/* Thống kê đặt lịch */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">
              <CalendarCheck size={20} />
              Thống kê đặt lịch
            </h3>
            <p className="chart-subtitle">Tháng {selectedMonth}/{selectedYear}</p>
          </div>
          <AppointmentStatsChart data={appointmentData} />
        </div>

        {/* Doanh thu */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">
              <DollarSign size={20} />
              Doanh thu theo thời gian
            </h3>
            <p className="chart-subtitle">Tháng {selectedMonth}/{selectedYear}</p>
          </div>
          <RevenueChart data={revenueData} />
        </div>

        {/* Xu hướng dịch vụ */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">
              <TrendingUp size={20} />
              Xu hướng dịch vụ
            </h3>
            <p className="chart-subtitle">Tháng {selectedMonth}/{selectedYear}</p>
          </div>
          <div className="service-trends">
            <ServiceTrendsChart data={serviceTrendsData} />
            <div className="service-legend">
              {serviceTrendsData.map((item, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: item.fill }}></span>
                  {item.name} ({item.value}%)
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hoạt động người dùng */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">
              <Users size={20} />
              Hoạt động người dùng
            </h3>
            <p className="chart-subtitle">Tháng {selectedMonth}/{selectedYear}</p>
          </div>
          <UserActivityChart data={userActivityData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;