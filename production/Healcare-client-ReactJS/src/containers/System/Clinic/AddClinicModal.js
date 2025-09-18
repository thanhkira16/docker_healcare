import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import clinicService from "../../../services/clinicService";
import { toast } from "react-toastify";
import "./AddClinicModal.scss";

const mdParser = new MarkdownIt();

const AddClinicModal = ({ isOpen, onClose, onSuccess }) => {
    const intl = useIntl();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
        previewImgURL: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (event, field) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: "",
            });
        }
    };

    const handleEditorChange = ({ html, text }) => {
        setFormData({
            ...formData,
            descriptionMarkdown: text,
            descriptionHTML: html,
        });
        // Clear error when user starts typing
        if (errors.description) {
            setErrors({
                ...errors,
                description: "",
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
                    imageBase64: base64,
                });

                if (errors.image) {
                    setErrors({
                        ...errors,
                        image: "",
                    });
                }
            }
        } catch (error) {
            console.error('Error handling image change:', error);
        }
    };

    const validateForm = () => {
        return clinicService.validateClinicForm(formData, setErrors);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            address: "",
            imageBase64: "",
            descriptionHTML: "",
            descriptionMarkdown: "",
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
            const clinicData = {
                name: formData.name.trim(),
                address: formData.address.trim(),
                imageBase64: formData.imageBase64,
                descriptionHTML: formData.descriptionHTML,
                descriptionMarkdown: formData.descriptionMarkdown,
            };

            await clinicService.createClinic(clinicData);
            resetForm();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating clinic:', error);
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
        <div className="clinic-modal-overlay" onClick={handleClose}>
            <div className="clinic-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="clinic-modal-header">
                    <h3 className="clinic-modal-title">
                        <FormattedMessage id="manage-clinic.addNew" />
                    </h3>
                    <button 
                        className="clinic-modal-close" 
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="clinic-modal-body">
                    <div className="clinic-form-container">
                        {/* Name and Image */}
                        <div className="clinic-form-row">
                            <div className="clinic-form-group clinic-form-half">
                                <label htmlFor="clinicName">
                                    <FormattedMessage id="manage-clinic.clinicName" />
                                    <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="clinicName"
                                    className={`clinic-input ${errors.name ? 'error' : ''}`}
                                    value={formData.name}
                                    onChange={(event) => handleInputChange(event, "name")}
                                    placeholder="Nhập tên phòng khám..."
                                    disabled={isLoading}
                                />
                                {errors.name && <span className="error-message">{errors.name}</span>}
                            </div>

                            <div className="clinic-form-group clinic-form-half">
                                <label className="clinic-image-label">
                                    <FormattedMessage id="manage-clinic.clinicImage" />
                                    <span className="required">*</span>
                                </label>
                                <div className="clinic-image-container">
                                    <input
                                        type="file"
                                        className="clinic-file-input"
                                        id="clinicImage"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        disabled={isLoading}
                                    />
                                    <label 
                                        htmlFor="clinicImage" 
                                        className={`clinic-upload-btn ${errors.image ? 'error' : ''}`}
                                    >
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        Tải ảnh lên
                                    </label>
                                    {formData.previewImgURL && (
                                        <div
                                            className="clinic-preview-image"
                                            style={{
                                                backgroundImage: `url(${formData.previewImgURL})`,
                                            }}
                                        />
                                    )}
                                </div>
                                {errors.image && <span className="error-message">{errors.image}</span>}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="clinic-form-row">
                            <div className="clinic-form-group clinic-form-full">
                                <label htmlFor="clinicAddress">
                                    <FormattedMessage id="manage-clinic.clinicAddress" />
                                </label>
                                <input
                                    type="text"
                                    id="clinicAddress"
                                    className="clinic-input"
                                    value={formData.address}
                                    onChange={(event) => handleInputChange(event, "address")}
                                    placeholder="Nhập địa chỉ phòng khám..."
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="clinic-form-row">
                            <div className="clinic-form-group clinic-form-full">
                                <label>
                                    <FormattedMessage id="manage-clinic.clinicDescription" />
                                    <span className="required">*</span>
                                </label>
                                <div className={`clinic-editor-container ${errors.description ? 'error' : ''}`}>
                                    <MdEditor
                                        style={{ height: "300px" }}
                                        renderHTML={(text) => mdParser.render(text)}
                                        onChange={handleEditorChange}
                                        value={formData.descriptionMarkdown}
                                        placeholder="Nhập mô tả chi tiết về phòng khám..."
                                        readOnly={isLoading}
                                    />
                                </div>
                                {errors.description && <span className="error-message">{errors.description}</span>}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="clinic-form-row">
                            <div className="clinic-form-group clinic-form-full">
                                <div className="clinic-form-buttons">
                                    <button
                                        className="clinic-btn clinic-btn-secondary"
                                        onClick={handleClose}
                                        disabled={isLoading}
                                    >
                                        <i className="fas fa-times"></i>
                                        <FormattedMessage id="manage-clinic.btnCancel" />
                                    </button>
                                    <button
                                        className="clinic-btn clinic-btn-primary"
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
                                                <FormattedMessage id="manage-clinic.btnSave" />
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

export default AddClinicModal;