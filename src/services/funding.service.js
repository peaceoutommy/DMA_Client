import api from "./api";

export const fundingService = {
    async requestFunding(fundingData) {
        const data = await api.post('/companies/funding', fundingData);
        return data;
    },
    async getFundRequests(campaignId) {
        const data = await api.get(`/campaigns/${campaignId}/fund-requests`);
        return data;
    },
    async getFundRequestById(id) {
        const data = await api.get(`/fund-requests/${id}`);
        return data;
    }
}
