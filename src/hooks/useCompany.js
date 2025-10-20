import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '@/services/company.service';

export const companyKeys = {
    all: ['companies'],
    lists: () => [...companyKeys.all, 'list'],
    list: (filters) => [...companyKeys.lists(), filters],
    details: () => [...companyKeys.all, 'detail'],
    detail: (id) => [...companyKeys.details(), id],
    types: () => [...companyKeys.all, 'types'],
    type: (id) => [...companyKeys.types(), id],
}

export const useCompanies = () => {
    return useQuery({
        queryKey: companyKeys.all,
        queryFn: () => companyService.getAll().then(res => res.data.companies),
    });
}

export const useCompany = (id) => {
    return useQuery({
        queryKey: companyKeys.detail(id),
        queryFn: () => companyService.getById(id).then(res => res.data),
    });
}
export const useCreateCompany = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => companyService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(companyKeys.lists());
        },
    });
};

export const useCompanyTypes = () =>{
    return useQuery({
        queryKey: companyKeys.types(),
        queryFn: () => companyService.getAllTypes().then(res => res.data.types),
    });
}

export const useCreateCompanyType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => companyService.createType(data),
        onSuccess: () => {
            queryClient.invalidateQueries(companyKeys.lists());
        },
    });
};
