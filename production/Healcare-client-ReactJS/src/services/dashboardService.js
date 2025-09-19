// Healthcare Dashboard service to handle dashboard statistics

export const getDashboardStats = () => [
  { 
    title: "New appointments today", 
    value: "24", 
    color: "blue", 
    icon: "�", 
    subtitle: "Scheduled today" 
  },
  { 
    title: "Patients waiting", 
    value: "8", 
    color: "green", 
    icon: "👨‍⚕️", 
    subtitle: "In queue" 
  },
  { 
    title: "Available doctors", 
    value: "12", 
    color: "green", 
    icon: "🩺", 
    subtitle: "On duty" 
  },
  { 
    title: "Emergency cases", 
    value: "3", 
    color: "red", 
    icon: "🚨", 
    subtitle: "Critical" 
  },
];

export const getDoctorStats = () => [
  { 
    title: "Total Doctors", 
    value: "45", 
    color: "blue", 
    icon: "👨‍⚕️", 
    subtitle: "Active doctors" 
  },
  { 
    title: "Appointments Today", 
    value: "18", 
    color: "green", 
    icon: "📅", 
    subtitle: "Scheduled today" 
  },
];

export const getPatientStats = () => [
  { 
    title: "Total Patients", 
    value: "1,234", 
    color: "blue", 
    icon: "👥", 
    subtitle: "Registered patients" 
  },
  { 
    title: "New Patients", 
    value: "23", 
    color: "green", 
    icon: "👤", 
    subtitle: "This week" 
  },
];