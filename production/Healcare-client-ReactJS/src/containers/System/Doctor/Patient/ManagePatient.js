import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ManagePatient.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES, CommonUtils } from "../../../../utils";
import patientService from "../../../../services/patientService";
import { toast } from "react-toastify";
import Table from "../../../../components/Table/Table";
import Search from "../../../../components/Search";
import AddPatientModal from "./AddPatientModal";

const ManagePatient = () => {
  const dispatch = useDispatch();
  const { language } = useSelector(state => state.app);
  const { userInfo } = useSelector(state => state.user);

  const [patientsList, setPatientsList] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().getTime());

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetchAllPatients();
    }
  }, [userInfo]);

  const fetchAllPatients = async () => {
    if (!userInfo || !userInfo.id) {
      console.error('Doctor information not available');
      return;
    }

    console.log('Fetching patients for doctor:', userInfo.id, 'date:', selectedDate, 'formatted date:', new Date(selectedDate));

    setIsLoading(true);
    try {
      const result = await patientService.fetchAllPatients(userInfo.id, selectedDate);
      
      console.log('Fetch result:', result);
      
      if (result.success) {
        setPatientsList(result.data || []);
        setFilteredPatients(result.data || []);
        console.log('Updated patients list:', result.data);
      } else {
        console.error('Failed to fetch patients:', result.message);
        setPatientsList([]);
        setFilteredPatients([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatientsList([]);
      setFilteredPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    fetchAllPatients();
  };

  const handleDateChange = async (event) => {
    const selectedDate = event.target.value;
    const timestamp = new Date(selectedDate).getTime();
    setSelectedDate(timestamp);
    
    if (userInfo && userInfo.id) {
      setIsLoading(true);
      try {
        const result = await patientService.fetchAllPatients(userInfo.id, timestamp);
        
        if (result.success) {
          setPatientsList(result.data || []);
          setFilteredPatients(result.data || []);
        } else {
          console.error('Failed to fetch patients:', result.message);
          setPatientsList([]);
          setFilteredPatients([]);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        setPatientsList([]);
        setFilteredPatients([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Search functionality
  const handleSearchChange = (value) => {
    setSearchValue(value);
    filterPatients(value);
  };

  const filterPatients = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patientsList);
      return;
    }

    const filtered = patientsList.filter(patient => {
      const fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase();
      const email = (patient.email || '').toLowerCase();
      const phoneNumber = (patient.phoneNumber || '').toLowerCase();
      const search = searchTerm.toLowerCase();

      return fullName.includes(search) || 
             email.includes(search) || 
             phoneNumber.includes(search);
    });

    setFilteredPatients(filtered);
  };

  // Update filtered patients when patients list changes
  useEffect(() => {
    filterPatients(searchValue);
  }, [patientsList]);

  const formatDateForInput = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  // Placeholder functions for future CRUD operations
  const handleEditPatient = (patient) => {
    // TODO: Implement edit functionality
    console.log('Edit patient:', patient);
  };

  const handleDeletePatient = (patient) => {
    // TODO: Implement delete functionality
    console.log('Delete patient:', patient);
  };

  // Render function component
  const columns = [
    {
      title: <FormattedMessage id="manage-patient.columnAvatar" />,
      dataIndex: "image",
      width: "100px",
      align: "center",
      render: (image, record) => (
        <div className="patient-avatar-cell">
          {image ? (
            <img
              src={image}
              alt={`${record.firstName} ${record.lastName}`}
              className="patient-avatar"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
          ) : (
            <div className="no-avatar">
              <i className="fas fa-user"></i>
            </div>
          )}
        </div>
      ),
    },
    {
      title: <FormattedMessage id="manage-patient.columnName" />,
      dataIndex: "firstName",
      width: "200px",
      render: (firstName, record) => (
        <div className="patient-name">
          <strong>{`${record.firstName || ''} ${record.lastName || ''}`.trim() || 'N/A'}</strong>
          <div className="patient-email">{record.email}</div>
        </div>
      ),
    },
    {
      title: <FormattedMessage id="manage-patient.columnGender" />,
      dataIndex: "gender",
      width: "100px",
      align: "center",
      render: (gender) => {
        // Xử lý các format gender khác nhau
        let isMale = false;
        
        if (gender === '1' || gender === 1 || gender === 'M' || gender === 'Male' || gender === 'Nam') {
          isMale = true;
        } else if (gender === '0' || gender === 0 || gender === 'F' || gender === 'Female' || gender === 'Nữ') {
          isMale = false;
        }
        
        return (
          <div className="patient-gender">
            {isMale ? 
              <FormattedMessage id="manage-patient.male" /> : 
              <FormattedMessage id="manage-patient.female" />
            }
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="manage-patient.columnPhone" />,
      dataIndex: "phoneNumber",
      width: "180px",
      render: (phone) => (
        <div className="patient-phone">
          {phone || <FormattedMessage id="manage-patient.emptyPhone" />}
        </div>
      ),
    },
    {
      title: <FormattedMessage id="manage-patient.columnAddress" />,
      dataIndex: "address",
      width: "180px",
      render: (address) => (
        <div className="patient-address">
          {address || <FormattedMessage id="manage-patient.emptyAddress" />}
        </div>
      ),
    },
    {
      title: <FormattedMessage id="manage-patient.columnTime" />,
      dataIndex: "timeTypeData",
      width: "150px",
      align: "center",
      render: (timeTypeData, record) => (
        <div className="patient-time">
          <div className="time-slot">
            {timeTypeData ? 
              (language === LANGUAGES.VI ? timeTypeData.valueVi : timeTypeData.valueEn) : 
              "N/A"
            }
          </div>
        </div>
      ),
    },
    {
      title: <FormattedMessage id="manage-patient.columnStatus" />,
      dataIndex: "statusId",
      width: "150px",
      align: "center",
      render: (statusId) => {
        let statusText = "";
        let statusClass = "";
        
        switch(statusId) {
          case "S1":
            statusText = <FormattedMessage id="manage-patient.statusNew" />;
            statusClass = "status-new";
            break;
          case "S2": 
            statusText = <FormattedMessage id="manage-patient.statusConfirmed" />;
            statusClass = "status-confirmed";
            break;
          case "S3":
            statusText = <FormattedMessage id="manage-patient.statusDone" />;
            statusClass = "status-done";
            break;
          default:
            statusText = "N/A";
            statusClass = "status-unknown";
        }
        
        return (
          <div className={`patient-status ${statusClass}`}>
            <span className="status-badge">{statusText}</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="manage-patient-wrapper">
      <div className="manage-patient-container">
        <div className="admin-header">
          <div className="admin-title">
            <h1>
              <FormattedMessage id="manage-patient.title" />
            </h1>
          </div>
          <div className="header-controls">
            <div className="date-filter">
              <label htmlFor="date-picker">
                <FormattedMessage id="manage-patient.selectDate" />:
              </label>
              <input
                id="date-picker"
                type="date"
                value={formatDateForInput(selectedDate)}
                onChange={handleDateChange}
                className="date-input"
              />
            </div>
            <button
              className="btn-add-patient"
              onClick={handleOpenModal}
            >
              <FormattedMessage id="manage-patient.addNew" />
            </button>
          </div>
        </div>

        <div className="patient-content">
          <div className="search-section">
            <Search
              placeholder="search.patient.placeholder"
              value={searchValue}
              onChange={handleSearchChange}
              label="search.patient.label"
              showLabel={true}
              size="medium"
              variant="default"
              clearable={true}
            />
          </div>

          <div className="patient-table-wrapper">
            <Table
              data={filteredPatients}
              columns={columns}
              loading={isLoading}
              emptyMessage={<FormattedMessage id="manage-patient.emptyMessage" />}
              striped={true}
              hover={true}
            />
          </div>
        </div>
      </div>

      <AddPatientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default ManagePatient;