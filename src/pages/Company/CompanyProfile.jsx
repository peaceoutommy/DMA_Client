import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    Globe,
    Mail,
    ArrowLeft,
    CheckCircle2,
    TrendingUp,
    Files,
    CalendarDays
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Your Custom Components & Hooks
import CampaignCard from '@/components/CampaignCard';
import { useCompanies } from '@/hooks/useCompany';
import { useCampaigns } from '@/hooks/useCampaign';
import { formatCurrency } from '@/utils/currency'; // Assuming you have this based on your Card code

export default function CompanyProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. Fetch Data
    // Note: In a real app, you might have a specific useCompany(id) hook. 
    // Here we use the lists and find the specific item to match your provided hooks.
    const { data: companies, isLoading: isLoadingCompany } = useCompanies();
    const { data: campaigns, isLoading: isLoadingCampaigns } = useCampaigns();

    // 2. Derive specific company data
    const company = useMemo(() => {
        return companies?.find(c => c.id === id || c.id === Number(id));
    }, [companies, id]);

    // 3. Filter campaigns for this company
    const companyCampaigns = useMemo(() => {
        if (!campaigns || !company) return [];
        return campaigns.filter(c => c.company?.id === company.id);
    }, [campaigns, company]);

    // 4. Calculate Statistics
    const stats = useMemo(() => {
        if (!companyCampaigns.length) return { raised: 0, active: 0, total: 0 };
        return {
            raised: companyCampaigns.reduce((acc, curr) => acc + (curr.raisedFunds || 0), 0),
            active: companyCampaigns.filter(c => c.status === 'ACTIVE').length,
            total: companyCampaigns.length
        };
    }, [companyCampaigns]);

    // Loading State
    if (isLoadingCompany || isLoadingCampaigns) {
        return <ProfileSkeleton />;
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
                        {/* Verify Badge Logic (Example) */}
                        <Badge variant="secondary" className="gap-1">
                            <CheckCircle2 className="h-3 w-3 text-blue-500" /> Verified
                        </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {company.type?.name && (
                            <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" /> {company.type.name}
                            </span>
                        )}
                        {company.address && (
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {company.address || "Location N/A"}
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

                {/* Right Column: Content Tabs */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="campaigns" className="w-full">
                        <TabsList>
                            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                            <TabsTrigger value="about">About</TabsTrigger>
                        </TabsList>

                        <TabsContent value="campaigns" className="mt-6">
                            {companyCampaigns.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {companyCampaigns.map((campaign) => (
                                        <CampaignCard key={campaign.id} campaign={campaign} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border rounded-lg bg-muted/10">
                                    <p className="text-muted-foreground">No campaigns created yet.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="about" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>About {company.name}</CardTitle>
                                    <CardDescription>Company Overview</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="leading-7 text-muted-foreground">
                                        {company.description || "No description provided for this company."}
                                    </p>

                                    {/* Example placeholder for more static content */}
                                    <h3 className="text-lg font-semibold mt-6 mb-2">Our Mission</h3>
                                    <p className="leading-7 text-muted-foreground">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

// Simple Skeleton Loader for better UX
function ProfileSkeleton() {
    return (
        <div className="space-y-6 container mx-auto py-6">
            <Skeleton className="h-8 w-24" />
            <div className="flex gap-6">
                <Skeleton className="h-32 w-32 rounded-lg" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <Skeleton className="h-[1px] w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="h-64 w-full" />
                <div className="lg:col-span-2 grid grid-cols-2 gap-6">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    )
}