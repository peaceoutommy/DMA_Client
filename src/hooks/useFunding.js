import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fundingService } from '@/services/funding.service';

export const fundingKeys = {
    all: ['funding'],
    requests: () => [...fundingKeys.all, 'requests'],
    request: (id) => [...fundingKeys.all, 'request', id],
    campaignRequests: (campaignId) => [...fundingKeys.requests(), 'campaign', campaignId],
};

export const useRequestFunding = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (fundingData) => fundingService.requestFunding(fundingData).then(res => res.data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(fundingKeys.campaignRequests(variables.campaignId));
            queryClient.invalidateQueries(fundingKeys.requests());
        },
    });
};
