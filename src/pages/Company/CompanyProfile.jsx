import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    Globe,
    Mail,
    TrendingUp,
    Files,
    CalendarDays
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CampaignCard from '@/components/CampaignCard';
import { useCampaignsByCompany } from '@/hooks/useCampaign';
import { useCompany } from '@/hooks/useCompany'; // Added this to fetch company details
import { formatCurrency } from '@/utils/currency';

export default function CompanyProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch Company Details (for the header and sidebar)
    const { data: company, isLoading: isLoadingCompany } = useCompany(id);

    // Fetch Campaigns (for the list)
    const { data: campaigns, isLoading: isLoadingCampaigns } = useCampaignsByCompany(id);

    // Calculate Stats based on the fetched campaigns
    const stats = useMemo(() => {
        if (!campaigns || !campaigns.length) return { raised: 0, active: 0, total: 0 };
        return {
            raised: campaigns.reduce((acc, curr) => acc + (curr.raisedFunds || 0), 0),
            active: campaigns.filter(c => c.status === 'ACTIVE').length,
            total: campaigns.length
        };
    }, [campaigns]);

    if (isLoadingCampaigns || isLoadingCompany) {
        return (
            <div className="flex h-96 w-full items-center justify-center">
                <span className="text-muted-foreground animate-pulse">Loading profile...</span>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold">Company not found</h2>
                <Button variant="link" onClick={() => navigate(-1)}>Go back</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 container mx-auto py-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Logo Placeholder */}
                <div className="h-32 w-32 rounded-lg bg-muted flex items-center justify-center border shrink-0">
                    <Building2 className="h-12 w-12 text-muted-foreground" />
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {company.type?.name && (
                            <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" /> {company.type.name}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" /> Joined {new Date().getFullYear()}
                        </span>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Contact Info */}
                <div className="space-y-6">
                    {/* Quick Stats Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Impact Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <TrendingUp className="h-4 w-4" /> Total Raised
                                </div>
                                <div className="font-bold text-lg">{formatCurrency(stats.raised)}</div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Files className="h-4 w-4" /> Campaigns
                                </div>
                                <div className="font-bold">{stats.total} Total ({stats.active} Active)</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Company Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="space-y-1">
                                <span className="text-muted-foreground">Tax ID</span>
                                <p className="font-mono">{company.taxId || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-muted-foreground">Registration Number</span>
                                <p className="font-mono">{company.registrationNumber || 'N/A'}</p>
                            </div>
                            <Separator />
                            <div className="space-y-3 pt-2">
                                {company.website && (
                                    <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                                        <Globe className="h-4 w-4" /> Website
                                    </a>
                                )}
                                <a href={`mailto:contact@${company.name.toLowerCase().replace(' ', '')}.com`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                                    <Mail className="h-4 w-4" /> Contact Email
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Campaigns Grid (Takes up 2 columns space on large screens) */}
                <div className="lg:col-span-2 space-y-6">
                    {campaigns && campaigns.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {campaigns.map((campaign) => (
                                <CampaignCard key={campaign.id} campaign={campaign} variant="mini" />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border rounded-lg bg-muted/10">
                            <p className="text-muted-foreground">No campaigns created yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}