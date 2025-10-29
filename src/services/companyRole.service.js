import api from "./api";

export const companyRoleService = {
    async getAll(id) {
        const data = await api.get(`/companies/roles/${id}`);
        return data;
    },
    async create(roleData) {
        const data = await api.post('/companies/roles', roleData);
        return data;
    },
    async update(roleData) {
        const data = await api.put('/companies/roles', roleData);
        return data;
    },
    async delete(id) {
        const data = await api.delete(`/companies/roles/${id}`);
        return data;
    },
}