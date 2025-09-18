import { getAllUsers, createNewUserService, editUserService, deleteUserService, getAllPaitentsBookedAppoiment } from "./userService";
import { toast } from 'react-toastify';

class PatientService {
    constructor() {
        this.useMockData = true;
    }

    async fetchAllPatients(doctorId, date = new Date().getTime()) {
        try {
            if (!doctorId) {
                console.error('DoctorId is required to fetch patients');
                return {
                    success: false,
                    message: 'DoctorId is required',
                    data: []
                };
            }

            if (this.useMockData) {
                console.log('Using mock data for demo');
                return this.getMockPatientData();
            }

            const dateString = date.toString();
            
            console.log('Fetching patients with:', { doctorId, date, dateString });

            const response = await getAllPaitentsBookedAppoiment({
                doctorId: doctorId,
                date: dateString
            });
            
            console.log('API Response:', response);
            
            if (response && (response.errCode === 0 || response.data)) {
                let patientData = response.data || response.patients || [];
                
                if (!Array.isArray(patientData)) {
                    patientData = [];
                }
                
                console.log('Patient data from API:', patientData);
                
                // Nếu không có data từ API, return mock data để test
                if (patientData.length === 0) {
                    console.log('No data from API, returning mock data for testing');
                    return this.getMockPatientData();
                }
                
                // Format dữ liệu cho frontend
                const formattedPatients = patientData.map(item => {
                    const patient = item.patientData || item;
                    return {
                        id: patient.id || item.id,
                        email: patient.email,
                        firstName: patient.firstName,
                        lastName: patient.lastName,
                        address: patient.address,
                        gender: patient.gender,
                        genderData: patient.genderData,
                        phoneNumber: patient.phoneNumber,
                        image: patient.image,
                        
                        bookingId: item.id,
                        statusId: item.statusId,
                        date: item.date,
                        timeType: item.timeType,
                        timeTypeData: item.timeTypeData,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt
                    };
                });

                return {
                    success: true,
                    data: formattedPatients,
                    message: response.message || 'Patients fetched successfully'
                };
            } else {
                return {
                    success: false,
                    data: [],
                    message: response?.message || 'Failed to fetch patients'
                };
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'An error occurred while fetching patients'
            };
        }
    }

    async createPatient(patientData) {
        console.log('Create patient called with:', patientData);
        return {
            success: false,
            data: null,
            message: ''
        };
    }

    async updatePatient(patientId, patientData) {
        console.log('Update patient called with:', patientId, patientData);
        return {
            success: false,
            data: null,
            message: ''
        };
    }

    async deletePatient(patientId) {
        console.log('Delete patient called with:', patientId);
        return {
            success: false,
            data: null,
            message: ''
        };
    }

    // Processing and utility functions
    processPatientDataForTable(patientsData) {
        if (!Array.isArray(patientsData)) {
            return [];
        }

        return patientsData.map((patient, index) => ({
            ...patient,
            key: patient.id || index,
            image: patient.image || null,
            firstName: patient.firstName || 'N/A',
            lastName: patient.lastName || 'N/A',
            email: patient.email || '',
            phoneNumber: patient.phoneNumber || '',
            address: patient.address || '',
            gender: patient.gender || ''
        }));
    }

    validatePatientData(patientData) {
        const isValid = patientData && Object.keys(patientData).length > 0;

        return {
            isValid: isValid,
            errors: isValid ? [] : ['Dữ liệu không hợp lệ']
        };
    }

    showToastMessage(result) {
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.info(result.message);
        }
    }

    formatPatientName(patient) {
        if (!patient) {
            return 'N/A';
        }
        
        const firstName = patient.firstName || '';
        const lastName = patient.lastName || '';
        
        return `${firstName} ${lastName}`.trim() || 'N/A';
    }

    getMockPatientData() {
        console.log('Returning mock patient data for testing');
        
        const mockPatients = [
            {
                id: 1,
                email: "nguyenvana@gmail.com",
                firstName: "Nguyễn",
                lastName: "Văn A",
                address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
                gender: "M",
                genderData: { valueVi: "Nam", valueEn: "Male" },
                phoneNumber: "0901234567",
                image: null,
                // Thông tin booking
                bookingId: 1,
                statusId: "S1",
                date: new Date().getTime().toString(),
                timeType: "T1",
                timeTypeData: { valueVi: "8:00 - 9:00", valueEn: "8:00 - 9:00" },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                email: "tranthib@gmail.com",
                firstName: "Trần",
                lastName: "Thị B",
                address: "456 Lê Lợi, Quận 3, TP.HCM",
                gender: "F",
                genderData: { valueVi: "Nữ", valueEn: "Female" },
                phoneNumber: "0987654321",
                image: null,
                // Thông tin booking
                bookingId: 2,
                statusId: "S2",
                date: new Date().getTime().toString(),
                timeType: "T2",
                timeTypeData: { valueVi: "9:00 - 10:00", valueEn: "9:00 - 10:00" },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 3,
                email: "phamvanc@gmail.com",
                firstName: "Phạm",
                lastName: "Văn C",
                address: "789 Pasteur, Quận 1, TP.HCM",
                gender: "M",
                genderData: { valueVi: "Nam", valueEn: "Male" },
                phoneNumber: "0912345678",
                image: null,
                // Thông tin booking
                bookingId: 3,
                statusId: "S3",
                date: new Date().getTime().toString(),
                timeType: "T3",
                timeTypeData: { valueVi: "10:00 - 11:00", valueEn: "10:00 - 11:00" },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 4,
                email: "lethid@gmail.com",
                firstName: "Lê",
                lastName: "Thị D",
                address: "321 Trần Hưng Đạo, Quận 5, TP.HCM",
                gender: "F",
                genderData: { valueVi: "Nữ", valueEn: "Female" },
                phoneNumber: "0923456789",
                image: null,
                // Thông tin booking
                bookingId: 4,
                statusId: "S2",
                date: new Date().getTime().toString(),
                timeType: "T4",
                timeTypeData: { valueVi: "14:00 - 15:00", valueEn: "14:00 - 15:00" },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 5,
                email: "hoangvane@gmail.com",
                firstName: "Hoàng",
                lastName: "Văn E",
                address: "654 Võ Văn Tần, Quận 3, TP.HCM",
                gender: "M",
                genderData: { valueVi: "Nam", valueEn: "Male" },
                phoneNumber: "0934567890",
                image: null,
                // Thông tin booking
                bookingId: 5,
                statusId: "S1",
                date: new Date().getTime().toString(),
                timeType: "T5",
                timeTypeData: { valueVi: "15:00 - 16:00", valueEn: "15:00 - 16:00" },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        return {
            success: true,
            data: mockPatients,
            message: 'Mock data loaded successfully'
        };
    }
}

export default new PatientService();