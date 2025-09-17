import { getAllClinics as getAllClinicsApi, createClinic as createClinicApi } from './userService';
import { toast } from 'react-toastify';

class ClinicService {

    async fetchAllClinics() {
        try {
            const response = await getAllClinicsApi();
            if (response && response.errCode === 0) {
                return {
                    success: true,
                    data: response.data || [],
                    message: ''
                };
            } else {
                return {
                    success: false,
                    data: [],
                    message: ''
                };
            }
        } catch (error) {
            console.error('Error fetching clinics:', error);
            return {
                success: false,
                data: [],
                message: ''
            };
        }
    }

    async createClinic(clinicData) {
        console.log('Create clinic called with:', clinicData);
        return {
            success: false,
            data: null,
            message: ''
        };
    }

    async updateClinic(clinicId, clinicData) {
        console.log('Update clinic called with:', clinicId, clinicData);
        return {
            success: false,
            data: null,
            message: ''
        };
    }

    async deleteClinic(clinicId) {
        console.log('Delete clinic called with:', clinicId);
        return {
            success: false,
            data: null,
            message: ''
        };
    }

    processClinicDataForTable(clinicsData) {
        if (!Array.isArray(clinicsData)) {
            return [];
        }

        return clinicsData.map((clinic, index) => ({
            ...clinic,
            key: clinic.id || index,
            image: clinic.image || clinic.imageBase64 || null,
            name: clinic.name || 'N/A',
            address: clinic.address || '',
            descriptionHTML: clinic.descriptionHTML || '',
            descriptionMarkdown: clinic.descriptionMarkdown || ''
        }));
    }

    validateClinicData(clinicData) {
        const isValid = clinicData && Object.keys(clinicData).length > 0;

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

    formatDescriptionForDisplay(description, maxLength = 100) {
        if (!description) {
            return 'Chưa có mô tả';
        }

        const textOnly = description.replace(/<[^>]*>/g, '');

        if (textOnly.length <= maxLength) {
            return description;
        }

        const truncated = textOnly.substring(0, maxLength);
        return truncated + '...';
    }
}

const clinicService = new ClinicService();
export default clinicService;

export { ClinicService };