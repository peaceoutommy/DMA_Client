import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '@/services/campaign.service';

export const campaignKeys = {
    all: ['campaigns'],
    lists: () => [...campaignKeys.all, 'list'],
    list: (filters) => [...campaignKeys.lists(), filters],
    detail: (id) => [...campaignKeys.all, 'detail', id],
};

export const useCampaigns = () => {
    return useQuery({
        queryKey: campaignKeys.all,
        queryFn: () => campaignService.getAll().then(res => res.data.campaigns)
    });
}

export const useCampaign = (id) => {
    return useQuery({
        queryKey: campaignKeys.detail(id),
        queryFn: () => campaignService.getById(id).then(res => res.data),
        enabled: !!id,
    });
}

export const useCreateCampaign = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newCampaign) => campaignService.create(newCampaign).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries(campaignKeys.lists());
        },
    });
}
