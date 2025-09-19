const PATHS = {
  HOME: "/",
  HOMEPAGE: "/home",
  HEALTHY: "/healthy",
  LOGIN: "/login",
  LOG_OUT: "/logout",
  REGISTER: "/register",
  DETAIL_DOCTOR: "/detail-doctor/:id",
  DETAIL_SPECIALTY: "/detail-specialty/:id",
  DETAIL_CLINIC: "/detail-clinic/:id",
  VERIFY_EMAIL_BOOKING: "/verify-booking",
  SYSTEM: {
    BASE: "/system",
    DASHBOARD: "/system/dashboard",
    USER_MANAGE: "/system/user-manage",
    USER_REDUX: "/system/user-redux",
    MANAGE_DOCTOR: "/system/manage-doctor",
    MANAGE_SPECIALTY: "/system/manage-specialty",
    MANAGE_CLINIC: "/system/manage-clinic",
  },
  DOCTOR: {
    BASE: "/doctor",
    MANAGE_SCHEDULE: "/doctor/manage-schedule",
    MANAGE_PATIENT: "/doctor/manage-patient",
  },
};

export default PATHS;