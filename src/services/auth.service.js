import api from "./api";
import { tokenStorage } from "../utils/token";

export const authService = {
    async login(credentials) {
        const { data } = await api.post('/auth/login', {
            username: credentials.email,
            password: credentials.password
        });

        if (data.token) {
            tokenStorage.set(data.token);
        }

        return data;
    },

    async register(details) {
        const { data } = await api.post('/auth/register', details);
        if (data.token) {
            tokenStorage.set(data.token);
        }
        return data;
    },

    async authMe() {
        const response = await api.get('/auth/me');
        return response
    },

    async logout() {
        tokenStorage.clear();
    }
}