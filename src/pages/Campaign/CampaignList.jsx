import React, { useEffect, useState } from 'react';
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
  const campaigns = data?.campaigns || [];

  const campaignsHardCoded = [
    {
      id: 1,
      name: 'Clean Water Initiative',
      description: 'Providing clean drinking water to rural communities in need. This campaign aims to build sustainable water infrastructure.',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      status: 'ACTIVE',
      fundGoal: 50000,
      raisedFunds: 32500,
      images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'],
      company: { name: 'WaterAid Foundation' }
    },
    {
      id: 2,
      name: 'Education for All',
      description: 'Building schools and providing educational resources to underprivileged children across the region.',
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      status: 'ACTIVE',
      fundGoal: 75000,
      raisedFunds: 45000,
      images: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'],
      company: { name: 'Education Trust' }
    },
    {
      id: 3,
      name: 'Green Forest Recovery',
      description: 'Reforestation project to restore natural habitats and combat climate change through tree planting initiatives.',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      status: 'COMPLETED',
      fundGoal: 100000,
      raisedFunds: 105000,
      images: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800'],
      company: { name: 'Green Earth Org' }
    },
    {
      id: 4,
      name: 'Healthcare Access Program',
      description: 'Mobile healthcare units bringing medical services to remote areas lacking proper healthcare facilities.',
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      status: 'ACTIVE',
      fundGoal: 120000,
      raisedFunds: 15000,
      images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'],
      company: { name: 'Health First Initiative' }
    },
    {
      id: 5,
      name: 'Tech Training Hub',
      description: 'Providing free coding bootcamps and technology training to youth in underserved communities.',
      startDate: '2024-01-10',
      endDate: '2024-06-30',
      status: 'DRAFT',
      fundGoal: 60000,
      raisedFunds: 0,
      images: ['https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800'],
      company: { name: 'Tech4Good' }
    }
  ];

  campaignsHardCoded.forEach(campaign => {
    campaigns.push(campaign)
  })

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="sm:w-auto"
          onClick={() => navigate("/campaigns/create")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>

      </div>

      {/* Campaign Grid */}
      {filteredCampaigns.length > 0 ? (
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