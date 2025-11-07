import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyEmployeeService } from '@/services/companyEmployee.service';

export const companyEmployeeKeys = {
    all: ['companyEmployees'],
    lists: () => [...companyEmployeeKeys.all, 'lists'],
    list: (filters) => [...companyEmployeeKeys.all, filters],
};

export const useCompanyEmployee = (companyId) => {
    return useQuery({
        queryKey: companyEmployeeKeys.list({ companyId }),
        queryFn: () => companyEmployeeService.getAll(companyId).then(res => res.data),
        enabled: !!companyId
    })
}