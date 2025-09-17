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

  const [clinicsList, setClinicsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAllClinics();
  }, []);

  const fetchAllClinics = async () => {
    setIsLoading(true);

    const result = await clinicService.fetchAllClinics();

    if (result.success) {
      const processedData = clinicService.processClinicDataForTable(result.data);
      setClinicsList(processedData);
    } else {
      clinicService.showToastMessage(result);
      setClinicsList([]);
    }

    setIsLoading(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {  // Refresh danh sách sau khi thêm thành công
    fetchAllClinics();
  };

  const handleDeleteClinic = (clinic) => {
    console.log("Delete clinic:", clinic);
  };

  const handleEditClinic = (clinic) => {
    console.log("Edit clinic:", clinic);
  };

  // Render function component
  const columns = [
    {
      title: <FormattedMessage id="manage-clinic.columnImage" />,
      dataIndex: "image",
      width: "120px",
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
          <strong>{name}</strong>
        </div>
      ),
    },
    {
      title: <FormattedMessage id="manage-clinic.columnAddress" />,
      dataIndex: "address",
      render: (address) => (
        <div className="clinic-address">
          {address || <FormattedMessage id="manage-clinic.emptyMessage" />}
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
              : ""
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
    <>
      <div className="manage-clinic-container">
        <div className="clinic-header">
          <div className="clinic-title">
            <h2>
              <i className="fas fa-hospital-user"></i>
              <FormattedMessage id="manage-clinic.title" />
            </h2>
          </div>
          <button
            className="btn-add-clinic"
            onClick={handleOpenModal}
          >
            <i className="fas fa-plus"></i>
            <FormattedMessage id="manage-clinic.addNew" />
          </button>
        </div>

        <div className="clinic-content">
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

      <AddClinicModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

export default ManageClinic;
