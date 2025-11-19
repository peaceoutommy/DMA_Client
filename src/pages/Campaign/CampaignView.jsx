import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Building2, Edit, Share2, DollarSign, Target, EuroIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner"
import { useCampaign } from '@/hooks/useCampaign';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import DonationModal from '@/components/Modal/DonationModal';
import { useCreateDonation } from '@/hooks/useDonation';
import { useAuth } from '@/context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';


export default function CampaignView() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: campaign, isLoading, isError } = useCampaign(id);
    const createDonation = useCreateDonation();

    const [isDonateOpen, setIsDonateOpen] = useState(false);
    const [newDonation, setNewDonation] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);

    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);

    // Campaign status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'default';
            case 'COMPLETED':
                return 'secondary';
            case 'DRAFT':
                return 'outline';
            case 'CANCELLED':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const handleCancelDonation = () => {
        setIsDonateOpen(false);
        setClientSecret(null);
    }

    const handleSubmitDonate = () => {
        const donationData = {
            ...newDonation,
            amount: Math.round(parseFloat(newDonation.amount) * 100),
            userId: user.id,
            campaignId: campaign.id,
            companyId: campaign.companyId
        }

        createDonation.mutate(donationData, {
            onSuccess: (response) => {
                // setIsDonateOpen(false);
                // setNewDonation(null);
                setClientSecret(response.clientSecret);
            },
            onError: (error) => {
                toast.dismiss();
                const errorMessage = error.response?.data?.message ||
                    error.message ||
                    "Failed to donate";

                toast.error("Donation failed", {
                    position: "top-center",
                    description: errorMessage,
                });
            }
        })
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading campaign...</p>
                </div>
            </div>
        );
    }

    const fundingPercentage = Math.min((campaign.raisedFunds / campaign.fundGoal) * 100, 100);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{campaign.name}</h1>
                    {campaign.company && (
                        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            <span>{campaign.company.name}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 sm:gap-2 flex-wrap sm:flex-nowrap">
                    <Badge variant={getStatusVariant(campaign.status)} className="text-sm px-3 py-1">
                        {campaign.status}
                    </Badge>
                    <Button variant="outline" size="icon" className="shrink-0">
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/campaigns/edit/${id}`)}
                        className="shrink-0"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Campaign Image */}
                    {campaign.images && campaign.images.length > 0 && (
                        <Card className="overflow-hidden">
                            <img
                                src={campaign.images[0]}
                                alt={campaign.name}
                                className="w-full h-96 object-cover"
                            />
                        </Card>
                    )}

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>About This Campaign</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {campaign.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaign Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-primary/10 p-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">Start Date</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(campaign.startDate)}
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-primary/10 p-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">End Date</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(campaign.endDate)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Funding Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Funding Progress</CardTitle>
                            <CardDescription>
                                {fundingPercentage.toFixed(0)}% of goal reached
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <Progress value={fundingPercentage} className="h-3" />
                            </div>

                            {/* Funding Amount */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="text-sm">Raised</span>
                                    </div>
                                    <span className="text-2xl font-bold">
                                        {formatCurrency(campaign.raisedFunds)}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Target className="h-4 w-4" />
                                        <span className="text-sm">Goal</span>
                                    </div>
                                    <span className="text-lg font-semibold">
                                        {formatCurrency(campaign.fundGoal)}
                                    </span>
                                </div>
                            </div>

                            <Button onClick={user ? () => setIsDonateOpen(true) : () => navigate('/authenticate')} className="w-full" size="lg">
                                <EuroIcon className="h-4 w-4 mr-2" />
                                Donate Now
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Share Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Share This Campaign</CardTitle>
                            <CardDescription>
                                Help us reach our goal by sharing
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share Campaign
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <DonationModal
                open={isDonateOpen}
                onClose={handleCancelDonation}
                onSave={() => handleSubmitDonate()}
                campaign={campaign}
                newDonation={newDonation}
                setNewDonation={setNewDonation}
                clientSecret={clientSecret}
                stripePromise={stripePromise}
            />
        </div>
    );
}