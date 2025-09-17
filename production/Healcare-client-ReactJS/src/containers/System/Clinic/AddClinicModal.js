import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
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

    const handleInputChange = (event, field) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
    };

    const handleEditorChange = ({ html, text }) => {
        setFormData({
            ...formData,
            descriptionMarkdown: text,
            descriptionHTML: html,
        });
    };

    const handleImageChange = async (event) => {
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
        }
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
    };

    const handleSave = async () => {
        resetForm();
        if (onSuccess) onSuccess();
        onClose();
    };

    const handleClose = () => {
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
                        <i className="fas fa-hospital-user"></i>
                        <FormattedMessage id="manage-clinic.title" />
                    </h3>
                    <button className="clinic-modal-close" onClick={handleClose}>
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
                                    className="clinic-input"
                                    value={formData.name}
                                    onChange={(event) => handleInputChange(event, "name")}
                                    placeholder={intl.formatMessage({ id: "manage-clinic.placeholderName" })}
                                />
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
                                    />
                                    <label htmlFor="clinicImage" className="clinic-upload-btn">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <FormattedMessage id="manage-user.uploadImage" />
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
                                    placeholder={intl.formatMessage({ id: "manage-clinic.placeholderAddress" })}
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
                                <div className="clinic-editor-container">
                                    <MdEditor
                                        style={{ height: "300px" }}
                                        renderHTML={(text) => mdParser.render(text)}
                                        onChange={handleEditorChange}
                                        value={formData.descriptionMarkdown}
                                        placeholder={intl.formatMessage({ id: "manage-clinic.placeholderDescription" })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="clinic-modal-footer">
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
                                <FormattedMessage id="manage-clinic.saving" />
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
    );
};

export default AddClinicModal;