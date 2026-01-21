import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User,
    MapPin,
    Mail,
    CalendarDays,
    Heart,
    History,
    Wallet,
    ArrowUpRight,
    ShieldCheck,
    AtSign // Added icon for username
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDonationsByUser } from '@/hooks/useDonation';
import { formatCurrency } from '@/utils/currency';
import { useAuth } from '@/context/AuthContext';

export default function UserProfile() {
    const { id } = useParams();
    // Assuming useAuth also returns an isLoading state (crucial for page refreshes)
    const { user, isLoading: isLoadingAuth } = useAuth();
    const navigate = useNavigate();

    const { data: donations, isLoading: isLoadingDonations } = useDonationsByUser(id);

    const donationHistory = useMemo(() => {
        if (!donations) return [];
        return [...donations].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [donations]);

    const stats = useMemo(() => {
        if (!donations || !donations.length) return { totalDonated: 0, campaignsSupported: 0 };
        const totalDonated = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        const uniqueCampaigns = new Set(donations.map(d => d.campaignId)).size;
        return { totalDonated, campaignsSupported: uniqueCampaigns };
    }, [donations]);

    // Handle Global Loading (Auth + Data)
    if (isLoadingDonations || isLoadingAuth) {
        return (
            <div className="flex h-96 w-full items-center justify-center">
                <span className="text-muted-foreground animate-pulse">Loading profile...</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold">User not found</h2>
                <Button variant="link" onClick={() => navigate(-1)}>Go back</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 container mx-auto py-6">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-32 w-32 border-2 border-border shrink-0">
                    {/* Assuming the JSON might have an avatarUrl later, keeping it safe */}
                    <AvatarImage src={(user).avatarUrl} alt={user.username} />
                    <AvatarFallback className="text-4xl bg-muted">
                        {/* Initials from First and Last Name */}
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                    <div className="flex flex-col gap-1">
                        {/* Display First and Last Name */}
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {user.firstName} {user.lastName}
                            </h1>
                        </div>

                        {/* Display Username */}
                        <p className="text-lg text-muted-foreground font-medium">
                            @{user.username}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                        {/* Display Email */}
                        <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" /> {user.email}
                        </span>

                        {/* Optional: Location (if exists in your data later) */}
                        {(user).location && (
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {(user).location}
                            </span>
                        )}

                        {/* Join Date (Defaulting to current year if missing in JSON) */}
                        <span className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" /> Joined {new Date().getFullYear()}
                        </span>
                    </div>
                </div>

                <Button variant="outline">Edit Profile</Button>
            </div>

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">My Impact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Wallet className="h-4 w-4" /> Total Donated
                                </div>
                                <div className="font-bold text-xl text-green-600">
                                    {formatCurrency(stats.totalDonated / 100)}
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Heart className="h-4 w-4" /> Campaigns Supported
                                </div>
                                <div className="font-bold">{stats.campaignsSupported}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Content */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" /> Transaction History
                            </CardTitle>
                            <CardDescription>
                                A record of all your contributions to date.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {donationHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {donationHistory.map((donation, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/40 transition-colors">
                                            <div className="space-y-1">
                                                <div className="font-medium flex items-center gap-2">
                                                    {donation.campaignName}
                                                    <ArrowUpRight
                                                        className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                                                        onClick={() => navigate(`/campaigns/${donation.campaignId}`)}
                                                    />
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(donation.date).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:mt-0 flex items-center gap-4">
                                                <Badge variant="secondary" className="font-mono">
                                                    {formatCurrency(donation.amount / 100)}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-4">
                                        <Heart className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold text-lg">No donations yet</h3>
                                    <p className="text-muted-foreground mb-4">Support a campaign to see your history here.</p>
                                    <Button onClick={() => navigate('/explore')}>Explore Campaigns</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}