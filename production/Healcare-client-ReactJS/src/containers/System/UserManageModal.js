import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { createNewUserService, editUserService, getAllCodeService } from '../../services/userService';
import { LANGUAGES } from '../../utils/constant';
import { CommonUtils } from '../../utils';
import './UserManageModal.scss';

const UserManageModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  mode = 'create', // 'create' or 'edit'
  userData = null,
  allRoles = [],
  allGenders = []
}) => {
  const { language } = useSelector(state => state.app);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [roleId, setRoleId] = useState('');
  const [positionId, setPositionId] = useState('');
  const [image, setImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  const [allPositions, setAllPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load positions when component mounts
  useEffect(() => {
    getPositions();
  }, []);

  // Fill form when editing user
  useEffect(() => {
    if (mode === 'edit' && userData) {
      setEmail(userData.email || '');
      setPassword('');
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setPhoneNumber(userData.phoneNumber || '');
      setAddress(userData.address || '');
      setGender(userData.gender || '');
      setRoleId(userData.roleId || '');
      setPositionId(userData.positionId || '');
      setImage(userData.image || '');
      setPreviewImage(userData.image || '');
    } else {
      clearForm();
    }
  }, [mode, userData, isOpen]);

  // Get all positions from API
  const getPositions = async () => {
    try {
      const response = await getAllCodeService("POSITION");
      if (response && response.errCode === 0) {
        setAllPositions(response.data || []);
      }
    } catch (error) {
      console.error('Error getting positions:', error);
    }
  };

  // Clear all form fields
  const clearForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setAddress('');
    setGender('');
    setRoleId('');
    setPositionId('');
    setImage('');
    setPreviewImage('');
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await CommonUtils.getBase64(file);
        const preview = URL.createObjectURL(file);
        setImage(base64);
        setPreviewImage(preview);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Lỗi khi tải ảnh lên');
      }
    }
  };

  // Validate form before submit
  const validateForm = () => {
    if (!email.trim()) {
      toast.error('Vui lòng nhập email');
      return false;
    }

    if (mode === 'create' && !password) {
      toast.error('Vui lòng nhập mật khẩu');
      return false;
    }

    if (!firstName.trim()) {
      toast.error('Vui lòng nhập tên');
      return false;
    }

    if (!lastName.trim()) {
      toast.error('Vui lòng nhập họ');
      return false;
    }

    if (!phoneNumber.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return false;
    }

    if (!address.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return false;
    }

    if (!gender) {
      toast.error('Vui lòng chọn giới tính');
      return false;
    }

    if (!roleId) {
      toast.error('Vui lòng chọn vai trò');
      return false;
    }

    if (!positionId) {
      toast.error('Vui lòng chọn vị trí');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email không đúng định dạng');
      return false;
    }

    return true;
  };

  // Handle save user
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let response;
      
      if (mode === 'create') {
        // Create new user
        const newUser = {
          email: email.trim(),
          password: password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phoneNumber: phoneNumber.trim(),
          address: address.trim(),
          gender: gender,
          roleId: roleId,
          positionId: positionId,
          image: image
        };
        response = await createNewUserService(newUser);
      } else {
        // Edit existing user
        const updateUser = {
          id: userData.id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phoneNumber: phoneNumber.trim(),
          address: address.trim(),
          gender: gender,
          roleId: roleId,
          positionId: positionId,
          image: image
        };
        
        // Only update password if provided
        if (password) {
          updateUser.password = password;
        }
        
        response = await editUserService(updateUser);
      }

      if (response && response.errCode === 0) {
        toast.success(mode === 'create' ? 'Tạo người dùng thành công!' : 'Cập nhật người dùng thành công!');
        onSuccess();
        handleClose();
      } else {
        toast.error(response?.errMsg || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Có lỗi xảy ra khi lưu người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle close modal
  const handleClose = () => {
    if (!isLoading) {
      clearForm();
      onClose();
    }
  };

  // Get display text based on language
  const getDisplayText = (item) => {
    if (!item) return '';
    return language === LANGUAGES.VI ? 
      (item.valueVI || item.valueEN || item.keyMap) : 
      (item.valueEN || item.valueVI || item.keyMap);
  };

  if (!isOpen) return null;

  return (
    <div className="user-modal-backdrop" onClick={handleClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {mode === 'create' ? 'Thêm Người Dùng Mới' : 'Chỉnh Sửa Người Dùng'}
          </h3>
          <button className="close-btn" onClick={handleClose} disabled={isLoading}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="form-container">
            {/* Row 1: Email & Password */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email..."
                  disabled={isLoading || mode === 'edit'}
                />
              </div>
              <div className="form-group">
                <label>
                  Mật Khẩu {mode === 'create' && <span className="required">*</span>}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'edit' ? 'Để trống nếu không đổi mật khẩu' : 'Nhập mật khẩu...'}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Row 2: First Name & Last Name */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  Tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nhập tên..."
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label>
                  Họ <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nhập họ..."
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Row 3: Phone & Address */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  Số Điện Thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Nhập số điện thoại..."
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label>
                  Địa Chỉ <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ..."
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Row 4: Gender, Role, Position */}
            <div className="form-row three-cols">
              <div className="form-group">
                <label>
                  Giới Tính <span className="required">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Chọn giới tính</option>
                  {allGenders.map(item => (
                    <option key={item.keyMap} value={item.keyMap}>
                      {getDisplayText(item)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>
                  Vai Trò <span className="required">*</span>
                </label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Chọn vai trò</option>
                  {allRoles.map(item => (
                    <option key={item.keyMap} value={item.keyMap}>
                      {getDisplayText(item)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>
                  Vị Trí <span className="required">*</span>
                </label>
                <select
                  value={positionId}
                  onChange={(e) => setPositionId(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Chọn vị trí</option>
                  {allPositions.map(item => (
                    <option key={item.keyMap} value={item.keyMap}>
                      {getDisplayText(item)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 5: Image Upload */}
            <div className="form-row">
              <div className="form-group full-width">
                <label>Ảnh Đại Diện</label>
                <div className="image-upload">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isLoading}
                    hidden
                  />
                  <label htmlFor="imageUpload" className="upload-btn">
                    <i className="fas fa-cloud-upload-alt"></i>
                    Tải ảnh lên
                  </label>
                  {previewImage && (
                    <div className="image-preview">
                      <img src={previewImage} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            className="btn btn-cancel" 
            onClick={handleClose}
            disabled={isLoading}
          >
            <i className="fas fa-times"></i>
            Hủy
          </button>
          <button 
            className="btn btn-save" 
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
                {mode === 'create' ? 'Lưu' : 'Cập nhật'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManageModal;