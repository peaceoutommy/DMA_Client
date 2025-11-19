import React, { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CampaignCard from '@/components/CampaignCard';
import { useCampaigns } from '@/hooks/useCampaign';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function CampaignList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading, isError, error, isFetching } = useCampaigns();

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

  if (!data) return <p>Loading...</p>

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
            {user?.role === "ADMIN" && (
              <>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>

        {user?.role === "COMPANY_ACCOUNT" && <Button
          className="sm:w-auto"
          onClick={() => navigate("/campaigns/create")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>}
      </div>

      {/* Campaign Grid */}
      {filteredCampaigns?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No campaigns found</p>
        </div>
      )}
    </div>
  );
}