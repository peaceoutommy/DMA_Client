// useUser.hook.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

export const userKeys = {
    all: ['users'],
    lists: () => [...userKeys.all, 'lists'],
    list: (filters) => [...userKeys.lists(), filters],
    details: () => [...userKeys.all, 'detail'],
    detail: (id) => [...userKeys.details(), id],
    byEmail: (email) => [...userKeys.all, 'email', email],
    search: (emailQuery) => [...userKeys.all, 'search', emailQuery],
};

export const useUser = (userId) => {
    return useQuery({
        queryKey: userKeys.detail(userId),
        queryFn: () => userService.getById(userId).then(res => res.data),
        enabled: !!userId
    })
};

export const useUserByEmail = (email) => {
    return useQuery({
        queryKey: userKeys.byEmail(email),
        queryFn: () => userService.getByEmail(email).then(res => res.data),
        enabled: !!email
    })
};

export const useSearchUsersByEmail = (emailQuery) => {
    return useQuery({
        queryKey: userKeys.search(emailQuery),
        queryFn: () => userService.searchByEmail(emailQuery).then(res => res.data),
        enabled: !!emailQuery && emailQuery.length >= 3
    })
};