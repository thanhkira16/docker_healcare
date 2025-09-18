import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ManageClinic.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES, CommonUtils } from "../../../utils";
import clinicService from "../../../services/clinicService";
import { toast } from "react-toastify";
import Table from "../../../components/Table/Table";
import AddClinicModal from "./AddClinicModal";

const ManageClinic = () => {
  const dispatch = useDispatch();
  const { language } = useSelector(state => state.app);

  const [clinicsList, setClinicsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAllClinics();
  }, []);

  const fetchAllClinics = async () => {
    setIsLoading(true);
    try {
      const result = await clinicService.fetchAllClinics();
      if (result.success) {
        const processedData = clinicService.processClinicDataForTable(result.data);
        setClinicsList(processedData);
      }
    } catch (error) {
      console.error('Error fetching clinics:', error);
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
    fetchAllClinics();
  };

  const handleDeleteClinic = async (clinic) => {
    await clinicService.deleteClinic(clinic.id);
    fetchAllClinics();
  };

  const handleEditClinic = (clinic) => {
    clinicService.editClinic(clinic);
  };

  // Render function component
  const columns = [
    {
      title: <FormattedMessage id="manage-clinic.columnImage" />,
      dataIndex: "image",
      width: "120px",
      align: "center",
      render: (image, record) => (
        <div className="clinic-image-cell">
          {image ? (
            <img
              src={image}
              alt={record.name}
              className="clinic-thumbnail"
              onError={(e) => {
                e.target.src = "/default-clinic.png";
              }}
            />
          ) : (
            <div className="no-image">
              <i className="fas fa-hospital"></i>
            </div>
          )}
        </div>
      ),
    },
    {
      title: <FormattedMessage id="manage-clinic.columnName" />,
      dataIndex: "name",
      width: "250px",
      render: (name) => (
        <div className="clinic-name">
          <strong>{name || 'N/A'}</strong>
        </div>
      ),
    },
    {
      title: <FormattedMessage id="manage-clinic.columnAddress" />,
      dataIndex: "address",
      render: (address) => (
        <div className="clinic-address">
          {address || <FormattedMessage id="manage-clinic.emptyAddress" />}
        </div>
      ),
    },
    {
      title: <FormattedMessage id="manage-clinic.columnDescription" />,
      dataIndex: "descriptionHTML",
      render: (description) => (
        <div
          className="clinic-description"
          dangerouslySetInnerHTML={{
            __html: description
              ? clinicService.formatDescriptionForDisplay(description, 100)
              : "<em>Chưa có mô tả</em>"
          }}
        />
      ),
    },
  ];

  const actions = [
    {
      type: "primary",
      icon: "fas fa-edit",
      title: <FormattedMessage id="manage-clinic.actionEdit" />,
      onClick: (record) => handleEditClinic(record),
    },
    {
      type: "danger", 
      icon: "fas fa-trash",
      title: <FormattedMessage id="manage-clinic.actionDelete" />,
      onClick: (record) => handleDeleteClinic(record),
    },
  ];

  return (
    <div className="manage-clinic-wrapper">
      <div className="manage-clinic-container">
        <div className="admin-header">
          <div className="admin-title">
            <h1>
              <FormattedMessage id="manage-clinic.title" />
            </h1>
          </div>
          <button
            className="btn-add-clinic"
            onClick={handleOpenModal}
          >
            <FormattedMessage id="manage-clinic.addNew" />
          </button>
        </div>

        <div className="clinic-content">
          <div className="clinic-table-wrapper">
            <Table
              data={clinicsList}
              columns={columns}
              actions={actions}
              loading={isLoading}
              emptyMessage={<FormattedMessage id="manage-clinic.emptyMessage" />}
              striped={true}
              hover={true}
            />
          </div>
        </div>
      </div>

      <AddClinicModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default ManageClinic;
