import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { ticketService } from '@/services/ticket.service';

export const ticketKeys = {
    all: ['tickets'],
    lists: () => [...ticketKeys.all, 'lists'],
    list: (filter) => [...ticketKeys.lists(), filter],
    detail: (id) => [...ticketKeys.all, 'detail', id],
}

export const useTickets = () => {
    return useQuery({
        queryKey: ticketKeys.lists(),
        queryFn: () => ticketService.getAll().then(res => res.data.tickets),
    })
}

export const useTicket = (id) => {
    return useQuery({
        queryKey: ticketKeys.detail(id),
        queryFn: () => ticketService.getById(id).then(res => res.data),
    })
}

export const useCloseTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (closeDto) => ticketService.close(closeDto),
        onSuccess: () => queryClient.invalidateQueries(ticketKeys.lists()),
    })
}