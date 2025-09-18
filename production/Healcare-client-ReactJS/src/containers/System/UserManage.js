import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./UserManage.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES, CommonUtils } from "../../utils";
import {
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
} from "../../services/userService";
import { toast } from "react-toastify";
import Table from "../../components/Table/Table";
import Filter from "../../components/Filter/Filter";
import UserManageModal from "./UserManageModal";

const UserManage = () => {
  const dispatch = useDispatch();
  const { language } = useSelector(state => state.app);

  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [allGenders, setAllGenders] = useState([]);

  useEffect(() => {
    fetchAllUsers();
    fetchAllRoles();
    fetchAllGenders();
  }, []);

  // Re-render when language changes
  useEffect(() => {
    // Force re-render when language changes
  }, [language]);

  // Filter users when search term or filters change
  useEffect(() => {
    filterUsers();
  }, [usersList, searchTerm, selectedRole]);

  const filterUsers = () => {
    let filtered = [...usersList];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const email = (user.email || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return fullName.includes(searchLower) || email.includes(searchLower);
      });
    }

    // Filter by role
    if (selectedRole) {
      filtered = filtered.filter(user => user.roleId === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers("ALL");
      if (response && response.errCode === 0) {
        setUsersList(response.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsersList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllRoles = async () => {
    try {
      const response = await getAllCodeService("ROLE");
      console.log('Roles response:', response);
      if (response && response.errCode === 0) {
        console.log('Roles data:', response.data);
        setAllRoles(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setAllRoles([]);
    }
  };

  const fetchAllGenders = async () => {
    try {
      const response = await getAllCodeService("GENDER");
      if (response && response.errCode === 0) {
        setAllGenders(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching genders:', error);
      setAllGenders([]);
    }
  };

  const handleAddNewUser = () => {
    setModalMode('create');
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (user) => {
    try {
      const response = await deleteUserService(user.id);
      if (response && response.errCode !== 0) {
        toast.error(response.errMsg);
      } else {
        toast.success("User deleted successfully");
        await fetchAllUsers();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting user");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalSuccess = () => {
    fetchAllUsers();
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Filter handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterKey, value) => {
    switch (filterKey) {
      case 'roleId':
        setSelectedRole(value);
        break;
      default:
        break;
    }
  };

  const handleClearFilter = () => {
    setSearchTerm("");
    setSelectedRole("");
  };

  // Helper functions to get name from code
  const getRoleName = (roleId) => {
    const role = allRoles.find(item => item.keyMap === roleId);
    if (role) {
      return language === LANGUAGES.VI ? role.valueVI : role.valueEN;
    }
    return roleId;
  };

  const getGenderName = (genderId) => {
    const gender = allGenders.find(item => item.keyMap === genderId);
    if (gender) {
      return language === LANGUAGES.VI ? gender.valueVI : gender.valueEN;
    }
    return genderId;
  };

  // Table columns configuration following ManageClinic pattern
  const columns = [
    {
      title: <FormattedMessage id="manage-user.columnImage" />,
      dataIndex: "image",
      width: "120px",
      align: "center",
      render: (image, record) => (
        <div className="user-avatar-cell">
          {image ? (
            <img
              src={image}
              alt={record.email}
              className="user-avatar"
              onError={(e) => {
                e.target.src = "/avatar.png";
              }}
            />
          ) : (
            <img
              src="/avatar.png"
              alt="Default Avatar"
              className="user-avatar"
            />
          )}
        </div>
      ),
    },
    {
      title: <FormattedMessage id="manage-user.columnName" />,
      dataIndex: "firstName",
      width: "200px",
      render: (firstName, record) => (
        <div className="user-name">
          <strong>{firstName} {record.lastName || ''}</strong>
        </div>
      ),
    },
    {
      title: <FormattedMessage id="manage-user.columnEmail" />,
      dataIndex: "email",
      width: "250px",
      render: (email) => (
        <div className="user-email">{email}</div>
      ),
    },
    {
      title: <FormattedMessage id="manage-user.columnRole" />,
      dataIndex: "roleId",
      width: "150px",
      render: (roleId) => (
        <div className={`user-role ${roleId ? roleId.toLowerCase() : ''}`}>
          {getRoleName(roleId) || 'N/A'}
        </div>
      ),
    },
    {
      title: <FormattedMessage id="manage-user.columnGender" />,
      dataIndex: "gender",
      width: "100px",
      render: (gender) => (
        <div className="user-gender">
          {getGenderName(gender) || 'N/A'}
        </div>
      ),
    },
  ];

  const actions = [
    {
      type: "primary",
      icon: "fas fa-edit",
      // label: <FormattedMessage id="manage-user.actionEdit" />,
      onClick: (record) => handleEditUser(record),
    },
    {
      type: "danger",
      icon: "fas fa-trash",
      // label: <FormattedMessage id="manage-user.actionDelete" />,
      onClick: (record) => handleDeleteUser(record),
    },
  ];

  // Filter configuration
  const filterConfig = allRoles && allRoles.length > 0 ? [
    {
      key: 'roleId',
      type: 'select',
      label: 'Vai trò',
      options: [
        { value: '', label: 'Tất cả' },
        ...allRoles
          .filter(role => role && role.keyMap && (role.valueVI || role.valueEN))
          .map(role => {
            let label = language === LANGUAGES.VI ? 
              (role.valueVI || role.valueEN || role.keyMap) : 
              (role.valueEN || role.valueVI || role.keyMap);
            
            // Ensure label is always a string
            label = String(label || role.keyMap || 'Unknown');
            
            return {
              value: role.keyMap,
              label: label
            };
          })
      ]
    }
  ] : [];

  return (
    <div className="manage-user-wrapper">
      <div className="manage-user-container">
        <div className="admin-header">
          <div className="admin-title">
            <h1>
              <FormattedMessage id="manage-user.title" />
            </h1>
          </div>
          <button
            className="btn-add-user"
            onClick={handleAddNewUser}
          >
            <i className="fas fa-plus"></i>
            <FormattedMessage id="manage-user.addNew" />
          </button>
        </div>

        <Filter
          searchPlaceholder="Tìm Kiếm"
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filterConfig}
          onFilterChange={handleFilterChange}
        />

        <div className="user-content">
          <div className="user-table-wrapper">
            <Table
              data={filteredUsers}
              columns={columns}
              actions={actions}
              loading={isLoading}
              emptyMessage={<FormattedMessage id="manage-user.emptyMessage" />}
              striped={true}
              hover={true}
            />
          </div>
        </div>
      </div>

      <UserManageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        mode={modalMode}
        userData={selectedUser}
        allRoles={allRoles}
        allGenders={allGenders}
      />
    </div>
  );
};

export default UserManage;