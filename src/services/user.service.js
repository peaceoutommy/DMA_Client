import api from "./api";

export const userService = {
    async getById(userId) {
        const data = await api.get(`/users/${userId}`);
        return data;
    },
    async getByEmail(userEmail) {
        const data = await api.get(`/users/email/${userEmail}`);
        return data;
    },
    async searchByEmail(emailPart) {
        const data = await api.get(`/users/search/${emailPart}`);
        return data;
    }
};