import api from "./api";

export const donationService = {
    async donate(donation) {
        const data = await api.post(`/donations`, donation);
        return data;
    }
}