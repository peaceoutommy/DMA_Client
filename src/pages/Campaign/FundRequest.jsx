import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import CampaignFundPreview from '@/components/CampaignFundPreview';
import FundRequestModal from '@/components/Modal/FundRequestModal';
import { useCampaignsByCompany } from '@/hooks/useCampaign';
import { useRequestFunding } from '@/hooks/useFunding';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function FundRequest() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [fundRequestModalOpen, setFundRequestModalOpen] = useState(false);
    const [fundRequest, setFundRequest] = useState({ message: '', amount: '', companyId: null, campaignId: null });

    const { data, isLoading, isError, error } = useCampaignsByCompany(user?.companyId);

    const requestFundingMutation = useRequestFunding();

    const filteredCampaigns = useMemo(() => {
        if (!data) return [];
        return data.filter(campaign => {
            const matchesSearch =
                campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (campaign.company?.name && campaign.company.name.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [data, searchQuery, statusFilter]);

    const handleFundRequest = (campaign) => {
        setSelectedCampaign(campaign);
        setFundRequest({ message: '', amount: '' });
        setFundRequestModalOpen(true);
    };

    const handleSubmitFundRequest = async () => {
        try {
            await requestFundingMutation.mutateAsync({
                campaignId: selectedCampaign.id,
                message: fundRequest.message,
                amount: fundRequest.amount,
                companyId: user?.companyId,
            });
            toast.success('Funding request submitted successfully!');
            setFundRequestModalOpen(false);
            setFundRequest({ message: '', amount: '' });
            setSelectedCampaign(null);
        } catch (error) {
            toast.error('Failed to submit funding request. Please try again.');
        }
    };

    if (isLoading) return <p>Loading campaigns...</p>;
    if (isError) return <p>Error loading campaigns: {error?.message}</p>;

    return (
        <div className="space-y-6">
            {/* Menu */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search campaigns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Campaign Grid with Fund Request Option */}
            {filteredCampaigns?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCampaigns.map((campaign) => (
                        <CampaignFundPreview
                            key={campaign.id}
                            campaign={campaign}
                            onRequestFunding={handleFundRequest}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No campaigns found</p>
                </div>
            )}

            {/* Fund Request Modal */}
            <FundRequestModal
                open={fundRequestModalOpen}
                onClose={() => {
                    setFundRequestModalOpen(false);
                    setSelectedCampaign(null);
                    setFundRequest({ message: '', amount: '' });
                }}
                campaign={selectedCampaign}
                fundRequest={fundRequest}
                setFundRequest={setFundRequest}
                onSubmit={handleSubmitFundRequest}
                isLoading={requestFundingMutation.isPending}
            />
        </div>
    );
}
