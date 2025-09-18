import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";

// Utils and Services
import { LANGUAGES, CommonUtils } from "../../../utils";
import { createSpecialty } from "../../../services/userService";

// Styles
import "./ManageSpecialty.scss";

const mdParser = new MarkdownIt();

const ManageSpecialty = () => {
  const { language } = useSelector(state => state.app);

  // Component state
  const [name, setName] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [descriptionHTML, setDescriptionHTML] = useState("");
  const [descriptionMarkdown, setDescriptionMarkdown] = useState("");
  const [previewImgURL, setPreviewImgURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  // Handle markdown editor changes
  const handleEditorChange = ({ html, text }) => {
    setDescriptionMarkdown(text);
    setDescriptionHTML(html);
  };

  // Handle image upload
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await CommonUtils.getBase64(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewImgURL(objectUrl);
        setImageBase64(base64);
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error(
          language === LANGUAGES.VI 
            ? "Lỗi khi xử lý hình ảnh" 
            : "Error processing image"
        );
      }
    }
  };

  // Handle save specialty
  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      toast.error(<FormattedMessage id="manage-specialty.specialtyNameRequired" />);
      return;
    }

    if (!imageBase64) {
      toast.error(<FormattedMessage id="manage-specialty.specialtyImageRequired" />);
      return;
    }

    if (!descriptionHTML.trim() || !descriptionMarkdown.trim()) {
      toast.error(<FormattedMessage id="manage-specialty.specialtyDescriptionRequired" />);
      return;
    }

    setIsLoading(true);
    try {
      const response = await createSpecialty({
        name: name.trim(),
        imageBase64,
        descriptionHTML,
        descriptionMarkdown,
      });

      if (response && response.errCode === 0) {
        toast.success(<FormattedMessage id="manage-specialty.createSpecialtySuccess" />);
        // Reset form
        resetForm();
      } else {
        toast.error(response?.errMsg || <FormattedMessage id="manage-specialty.createSpecialtyFailed" />);
      }
    } catch (error) {
      console.error("Error creating specialty:", error);
      toast.error(<FormattedMessage id="manage-specialty.unknownError" />);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setImageBase64("");
    setDescriptionHTML("");
    setDescriptionMarkdown("");
    setPreviewImgURL("");
  };

  // Handle image preview click
  const openPreviewImage = () => {
    if (previewImgURL) {
      window.open(previewImgURL, '_blank');
    }
  };

  return (
    <div className="manage-specialty-wrapper">
      <div className="manage-specialty-container">
        <div className="admin-header">
          <div className="admin-title">
            <h1>
              <FormattedMessage id="manage-specialty.title" />
            </h1>
          </div>
        </div>

        <div className="specialty-form">
          {/* Basic Information */}
          <div className="form-row">
            {/* Specialty Name */}
            <div className="form-group">
              <label className="form-label">
                <FormattedMessage id="manage-specialty.specialtyName" />
                <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={handleNameChange}
                placeholder={
                  language === LANGUAGES.VI 
                    ? "Nhập tên chuyên khoa..." 
                    : "Enter specialty name..."
                }
              />
            </div>

            {/* Specialty Image */}
            <div className="form-group">
              <label className="form-label">
                <FormattedMessage id="manage-specialty.specialtyImage" />
                <span className="required">*</span>
              </label>
              <div className="image-upload-container">
                <input
                  type="file"
                  className="file-input"
                  id="specialty-image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label htmlFor="specialty-image" className="file-upload-btn">
                  <i className="fas fa-upload"></i>
                  <FormattedMessage id="manage-user.uploadImage" />
                </label>
                {previewImgURL && (
                  <div 
                    className="preview-image"
                    style={{ backgroundImage: `url(${previewImgURL})` }}
                    onClick={openPreviewImage}
                    title={
                      language === LANGUAGES.VI 
                        ? "Click để xem ảnh" 
                        : "Click to view image"
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* Specialty Description */}
          <div className="form-section">
            <label className="form-label">
              <FormattedMessage id="manage-specialty.specialtyDescription" />
              <span className="required">*</span>
            </label>
            <div className="markdown-editor-wrapper">
              <MdEditor
                style={{ height: "500px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
                value={descriptionMarkdown}
                placeholder={
                  language === LANGUAGES.VI 
                    ? "Nhập mô tả chuyên khoa..." 
                    : "Enter specialty description..."
                }
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-reset"
              onClick={resetForm}
              disabled={isLoading}
            >
              <i className="fas fa-undo"></i>
              <FormattedMessage id="manage-specialty.btnReset" />
            </button>
            
            <button
              type="button"
              className="btn-save"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {language === LANGUAGES.VI ? "Đang lưu..." : "Saving..."}
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <FormattedMessage id="manage-specialty.btnSave" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSpecialty;
