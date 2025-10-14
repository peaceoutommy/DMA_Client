import api from './api';

export const companyService = {
    async getAll() {
        const data = await api.get('/companies');
        return data
    },
    async getById(id) {
        const data = await api.get(`/companies/${id}`);
        return data;
    },
    async create(companyData) {
        const data = await api.post('/companies', companyData);
        return data;
    },

    async getAllTypes() {
        const data = await api.get('/companies/types');
        return data;
    },
    async getTypeById(id) {
        const data = await api.get(`/companies/types/${id}`);
        return data;
    },
    async createType(typeData) {
        const data = await api.post('/companies/types', typeData);
        return data;
    }
}