import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { CommonUtils } from "../../../../utils";
import patientService from "../../../../services/patientService";
import { toast } from "react-toastify";
import "./AddPatientModal.scss";

const AddPatientModal = ({ isOpen, onClose, onSuccess }) => {
    const intl = useIntl();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        gender: "", // Để trống để hiển thị placeholder "Chọn giới tính"
        roleId: "R3", // R3 = Patient role
        image: "", // Đổi từ avatar thành image để phù hợp với bảng users
        previewImgURL: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (event, field) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: "",
            });
        }
    };

    const handleImageChange = async (event) => {
        try {
            let data = event.target.files;
            let file = data[0];
            if (file) {
                let base64 = await CommonUtils.getBase64(file);
                let objectUrl = URL.createObjectURL(file);
                setFormData({
                    ...formData,
                    previewImgURL: objectUrl,
                    image: base64, // Đổi từ avatar thành image
                });

                if (errors.avatar) {
                    setErrors({
                        ...errors,
                        avatar: "",
                    });
                }
            }
        } catch (error) {
            console.error('Error handling image change:', error);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Validate required fields
        if (!formData.firstName.trim()) {
            newErrors.firstName = "Họ không được để trống";
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Tên không được để trống";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }
        
        if (!formData.gender) {
            newErrors.gender = "Vui lòng chọn giới tính";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            address: "",
            gender: "",
            roleId: "R3",
            image: "",
            previewImgURL: "",
        });
        setErrors({});
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // TODO: Implement actual patient creation logic
            console.log('Creating patient with data:', formData);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast.success('Thêm bệnh nhân thành công! (Demo mode)');
            
            resetForm();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating patient:', error);
            toast.error('Có lỗi xảy ra khi thêm bệnh nhân');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (isLoading) return;
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="patient-modal-overlay" onClick={handleClose}>
            <div className="patient-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="patient-modal-header">
                    <h3 className="patient-modal-title">
                        <FormattedMessage id="manage-patient.addNew" />
                    </h3>
                    <button 
                        className="patient-modal-close" 
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="patient-modal-body">
                    <div className="patient-form-container">
                        {/* Name Fields */}
                        <div className="patient-form-row">
                            <div className="patient-form-group patient-form-half">
                                <label htmlFor="firstName">
                                    <FormattedMessage id="manage-patient.firstName" />
                                    <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    className={`patient-input ${errors.firstName ? 'error' : ''}`}
                                    value={formData.firstName}
                                    onChange={(event) => handleInputChange(event, "firstName")}
                                    placeholder="Nhập tên..."
                                    disabled={isLoading}
                                />
                                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                            </div>

                            <div className="patient-form-group patient-form-half">
                                <label htmlFor="lastName">
                                    <FormattedMessage id="manage-patient.lastName" />
                                    <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className={`patient-input ${errors.lastName ? 'error' : ''}`}
                                    value={formData.lastName}
                                    onChange={(event) => handleInputChange(event, "lastName")}
                                    placeholder="Nhập họ..."
                                    disabled={isLoading}
                                />
                                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                            </div>
                        </div>

                        {/* Email and Phone */}
                        <div className="patient-form-row">
                            <div className="patient-form-group patient-form-half">
                                <label htmlFor="email">
                                    <FormattedMessage id="manage-patient.email" />
                                    <span className="required">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`patient-input ${errors.email ? 'error' : ''}`}
                                    value={formData.email}
                                    onChange={(event) => handleInputChange(event, "email")}
                                    placeholder="Nhập email..."
                                    disabled={isLoading}
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>

                            <div className="patient-form-group patient-form-half">
                                <label htmlFor="phoneNumber">
                                    <FormattedMessage id="manage-patient.phone" />
                                </label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    className="patient-input"
                                    value={formData.phoneNumber}
                                    onChange={(event) => handleInputChange(event, "phoneNumber")}
                                    placeholder="Nhập số điện thoại..."
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Gender and Avatar */}
                        <div className="patient-form-row">
                            <div className="patient-form-group patient-form-half">
                                <label htmlFor="gender">
                                    <FormattedMessage id="manage-patient.gender" />
                                    <span className="required">*</span>
                                </label>
                                <select
                                    id="gender"
                                    className={`patient-input ${errors.gender ? 'error' : ''}`}
                                    value={formData.gender}
                                    onChange={(event) => handleInputChange(event, "gender")}
                                    disabled={isLoading}
                                >
                                    <option value="">
                                        {intl.formatMessage({ id: "manage-patient.selectGender" })}
                                    </option>
                                    <option value="M">
                                        {intl.formatMessage({ id: "manage-patient.male" })}
                                    </option>
                                    <option value="F">
                                        {intl.formatMessage({ id: "manage-patient.female" })}
                                    </option>
                                </select>
                                {errors.gender && <span className="error-message">{errors.gender}</span>}
                            </div>

                            <div className="patient-form-group patient-form-half">
                                <label className="patient-avatar-label">
                                    <FormattedMessage id="manage-patient.avatar" />
                                </label>
                                <div className="patient-avatar-container">
                                    <input
                                        type="file"
                                        className="patient-file-input"
                                        id="patientAvatar"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        disabled={isLoading}
                                    />
                                    <label 
                                        htmlFor="patientAvatar" 
                                        className="patient-upload-btn"
                                    >
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        Tải ảnh lên
                                    </label>
                                    {formData.previewImgURL && (
                                        <div
                                            className="patient-preview-avatar"
                                            style={{
                                                backgroundImage: `url(${formData.previewImgURL})`,
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="patient-form-row">
                            <div className="patient-form-group patient-form-full">
                                <label htmlFor="address">
                                    <FormattedMessage id="manage-patient.address" />
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    className="patient-input"
                                    value={formData.address}
                                    onChange={(event) => handleInputChange(event, "address")}
                                    placeholder="Nhập địa chỉ..."
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="patient-form-row">
                            <div className="patient-form-group patient-form-full">
                                <div className="patient-form-buttons">
                                    <button
                                        className="patient-btn patient-btn-secondary"
                                        onClick={handleClose}
                                        disabled={isLoading}
                                    >
                                        <i className="fas fa-times"></i>
                                        <FormattedMessage id="manage-patient.btnCancel" />
                                    </button>
                                    <button
                                        className="patient-btn patient-btn-primary"
                                        onClick={handleSave}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save"></i>
                                                <FormattedMessage id="manage-patient.btnSave" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPatientModal;