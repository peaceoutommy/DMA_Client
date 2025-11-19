import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    ArrowRight,
    Heart,
    Users,
    Target,
    TrendingUp,
    Building2,
    Search,
    CheckCircle2,
    EuroIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/currency';
import { useCampaigns } from '@/hooks/useCampaign';
import { useAuth } from '@/context/AuthContext';
import CampaignCard from '@/components/CampaignCard';

export default function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredCampaigns, setFeaturedCampaigns] = useState(null);
    const { user } = useAuth();
    const { data, isLoading, isError, error, isFetching } = useCampaigns();


    useEffect(() => {
        if (data) {
            setFeaturedCampaigns(data?.slice(0, 3));
        }
    }, [data])

    const features = [
        {
            title: "Transparent Donations",
            description: "Track exactly where your donations go with complete transparency and real-time updates."
        },
        {
            title: "Verified Organizations",
            description: "All partner organizations are thoroughly vetted to ensure your contributions make real impact."
        },
        {
            title: "Flexible Giving",
            description: "Choose one-time donations or set up recurring contributions to causes you care about."
        },
        {
            title: "Impact Reports",
            description: "Receive detailed reports showing the tangible impact of your generous contributions."
        }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/campaigns?search=${searchQuery}`);
        }
    };

    if (isLoading) {
        return <div>loading...</div>
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative border-b">
                <div className="container mx-auto px-4 pb-20 lg:pb-32">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <Badge variant="outline" className="px-4 py-1.5 text-sm">
                            <TrendingUp className="h-3 w-3 mr-2" />
                            Join 15,000+ donors making a difference
                        </Badge>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                            Make a Difference,
                            <span className="block text-primary mt-2">One Donation at a Time</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Connect with verified organizations and support causes that matter to you.
                            Every contribution creates real, measurable impact in communities worldwide.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search for campaigns, causes, or organizations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-4 h-14 text-base shadow-lg"
                                />
                                <Button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    size="sm"
                                >
                                    Search
                                </Button>
                            </div>
                        </form>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Button size="lg" className="text-base px-8" onClick={() => navigate('/campaigns')}>
                                Browse Campaigns
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="text-base px-8" onClick={() => navigate('/authenticate')}>
                                Create an account
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Campaigns Section */}
            <section className="container mx-auto px-4 py-16 lg:py-24">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Featured Campaigns
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Discover inspiring campaigns making real impact in communities around the world
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredCampaigns?.map((campaign) => {
                        return (
                            <CampaignCard key={campaign.id} campaign={campaign}/>
                        );
                    })}
                </div>

                <div className="text-center mt-12">
                    <Button variant="outline" size="lg" onClick={() => navigate('/campaigns')}>
                        View All Campaigns
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="border-y">
                <div className="container mx-auto px-4 py-16 lg:py-24">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Why Choose Us
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            We're committed to making charitable giving simple, transparent, and impactful
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-2">
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-full bg-primary/10 p-3">
                                            <CheckCircle2 className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                                            <CardDescription className="text-base">
                                                {feature.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!user && <>
                <section className="container mx-auto px-4 py-16 lg:py-24">
                    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                        <CardContent className="p-8 lg:p-12">
                            <div className="max-w-3xl mx-auto text-center space-y-6">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                    Ready to Make an Impact?
                                </h2>
                                <p className="text-lg text-muted-foreground">
                                    Join thousands of donors who are creating positive change.
                                    Start supporting causes that matter to you today.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                                    <Button size="lg" className="text-base px-8" onClick={() => navigate('/authenticate')}>
                                        Create an account
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="text-base px-8"
                                        onClick={() => navigate('/campaigns/list')}
                                    >
                                        Explore campaigns
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </>}
        </div>
    );
}