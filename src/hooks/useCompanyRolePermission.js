import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyRolePermissionService } from '@/services/companyRolePermission.service';

export const companyRolePermissionKeys = {
    all: ['companyRolePermissions'],
    lists: () => [...companyRolePermissionKeys.all, 'list'],
    list: (filters) => [...companyRolePermissionKeys.lists(), filters],
    details: () => [...companyRolePermissionKeys.all, 'detail'],
    detail: (id) => [...companyRolePermissionKeys.details(), id],
};

export const useCompanyRolePermissions = () => {
    return useQuery({
        queryKey: companyRolePermissionKeys.list(),
        queryFn: () => companyRolePermissionService.getAll().then(res => res.data.permissions),
    });
};
export const useCreateCompanyRolePermission = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newPermission) => companyRolePermissionService.create(newPermission),
        onSuccess: () => {
            queryClient.invalidateQueries(companyRolePermissionKeys.list());
        },
    });
};