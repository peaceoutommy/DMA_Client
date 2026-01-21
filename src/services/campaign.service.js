import api from './api';

export const campaignService = {
    async getAll() {
        const data = await api.get('/campaigns');
        return data
    },
    async getByCompany(companyId) {
        const data = await api.get(`/campaigns/company/${companyId}`);
        return data;
    },
    async getById(id) {
        const data = await api.get(`/campaigns/${id}`);
        return data;
    },
    async create(campaignData) {
        const data = await api.post('/campaigns', campaignData);
        return data;
    }
}