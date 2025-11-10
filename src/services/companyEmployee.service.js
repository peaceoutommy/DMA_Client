import api from "./api";

export const companyEmployeeService = {
    async getAll(companyId) {
        const data = await api.get(`/companies/membership/${companyId}/employees`);
        return data;
    },
    async addEmployee(membership) {
        const data = await api.post(`/companies/membership`, membership);
        return data;
    }
}