import api from "./api";

export const donationService = {
    async donate(donation) {
        const data = await api.post(`/donations`, donation);
        return data;
    },
    async getDonationsByUser(userId) {
        const data = await api.get(`/donations/user/${userId}`);
        return data.data;
    }
}