import api from "./api";

export const companyEmployeeService={
    async getAll(companyId){
        const data = api.get(`/companies/${companyId}/employees`);
        return data;
    },
}