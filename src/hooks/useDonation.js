import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donationService } from '@/services/donation.service';

export const donationKeys = {
    all: ['donations'],
    lists: () => [...donationKeys.all, 'lists'],
    list: (filter) => [...donationKeys.lists(), filter],
    detail: (id) => [...campaignKeys.all, 'detail', id],
}

export const useDonations = (campaignId) => {

}

export const useCreateDonation = (donation) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (donation) => donationService.donate(donation).then(res => res.data),
        onSuccess: () => queryClient.invalidateQueries(donationKeys.lists()),
    })
}

export const useSaveDonation = () =>{
    const queryClient = useQueryClient();
    
}
