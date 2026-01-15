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
export const useAddEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (membership) => companyEmployeeService.addEmployee(membership),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: companyEmployeeKeys.list({ companyId: variables.companyId })
            });
        }
    })
}

export const useRemoveEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (membership) => companyEmployeeService.removeEmployee(membership),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: companyEmployeeKeys.list({ companyId: variables.companyId })
            });
        }
    })
}