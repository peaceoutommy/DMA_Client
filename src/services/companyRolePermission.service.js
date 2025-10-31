import api from "./api";

export const companyRolePermissionService = {
    async getAll() {
        const data = await api.get('/companies/roles/permissions');
        return data;
    },
    async create(permissionData) {
        const data = await api.post('/companies/roles/permission', permissionData);
        return data;
    },
    async getAllTypes() {
        const data = await api.get('/companies/roles/permissions/types')
        return data;
    },
    async update(permissionData) {
        const data = await api.put('/companies/roles/permission', permissionData);
        return data;
    },
    async delete(id) {
        const data = await api.delete(`/companies/roles/permission/${id}`);
        return data;
    }
};