import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyRoleService } from '@/services/companyRole.service';

export const companyRoleKeys = {
    all: ['companyRoles'],
    lists: () => [...companyRoleKeys.all, 'list'],
    list: (filters) => [...companyRoleKeys.lists(), filters],
    details: () => [...companyRoleKeys.all, 'detail'],
    detail: (id) => [...companyRoleKeys.details(), id],
};

export const useCompanyRoles = (companyId) => {
    return useQuery({
        queryKey: companyRoleKeys.list({ companyId }),
        queryFn: () => companyRoleService.getAll(companyId).then(res => res.data.roles),
        enabled: !!companyId,
    });
}
export const useCreateCompanyRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newRole) => companyRoleService.create(newRole),
        onSuccess: (data, variables) => { // variables gets the same data as passed to mutationFn (in this case, newRole)
            queryClient.invalidateQueries({
                queryKey: companyRoleKeys.list({ companyId: variables.companyId })
            });
        },
    });
};
export const useUpdateCompanyRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (role) => companyRoleService.update(role),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: companyRoleKeys.list({ companyId: variables.companyId })
            })
        }
    })
};
export const useDeleteCompanyRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (role) => companyRoleService.delete(role.id),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: companyRoleKeys.list({ companyId: variables.companyId })
            });
        },
    });
};