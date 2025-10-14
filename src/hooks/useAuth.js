import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useQueryClient, useQuery } from '@tanstack/react-query';

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => authService.authMe().then(res => res.data),
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            // Set the user data in cache
            queryClient.setQueryData(['user'], data.user);
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.register,
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], data.user);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            queryClient.clear(); // Clear all cached data
        },
    });
};