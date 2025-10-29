import api from "./api";

export const companyRolePermissionService = {
    async getAll() {
        const data = await api.get('/companies/roles/permissions');
        return data;
    },
    async create(permissionData) {
        const data = await api.post('/companies/roles/permission', permissionData);
        return data;
    }
};