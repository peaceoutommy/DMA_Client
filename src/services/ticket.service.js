import api from "./api";

export const ticketService = {
    async getAll() {
        const data = await api.get('/tickets');
        return data;
    },
    async getById(id) {
        const data = await api.get(`/tickets/${id}`);
        return data;
    },
    async close(closeDto) {
        await api.put('/tickets/close', closeDto);
    }
}