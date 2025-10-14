import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, Loader2, Target, CheckCircle } from 'lucide-react';
import { useCreateCampaign } from '@/hooks/useCampaign';

export default function CampaignCreate() {
    const createCampaign = useCreateCampaign();

    const [campaignData, setCampaignData] = useState({
        name: '',
        description: '',
        companyId: 1,
        fundGoal: ''
    });

    const [errors, setErrors] = useState({});

    const formatCurrency = (value) => {
        const number = value.replace(/[^0-9]/g, '');
        if (!number) return '';
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!campaignData.name.trim()) {
            newErrors.name = 'Campaign name is required';
        } else if (campaignData.name.trim().length < 3) {
            newErrors.name = 'Campaign name must be at least 3 characters';
        }

        if (!campaignData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (campaignData.description.trim().length < 20) {
            newErrors.description = 'Description must be at least 20 characters';
        }

        const goalAmount = parseInt(campaignData.fundGoal.replace(/[^0-9]/g, ''));
        if (!campaignData.fundGoal || isNaN(goalAmount)) {
            newErrors.fundGoal = 'Funding goal is required';
        } else if (goalAmount < 100) {
            newErrors.fundGoal = 'Funding goal must be at least $100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const payload = {
                name: campaignData.name.trim(),
                description: campaignData.description.trim(),
                fundGoal: parseFloat(campaignData.fundGoal.replace(/[^0-9]/g, '')),
                companyId: campaignData.companyId
            };

            createCampaign.mutate(payload, {
                onSuccess: () => {
                    setCampaignData({
                        name: '',
                        description: '',
                        companyId: 1,
                        fundGoal: ''
                    });
                    setErrors({});

                    setTimeout(() => {
                        createCampaign.reset();
                    }, 3000);
                },
            });
        }
    };

    return (
        <Card className="w-full max-w-md shadow-2xl border-0">
            <CardContent className="pb-4">
                <div className="space-y-3">

                    <div className="space-y-2">
                        <Label htmlFor="campaign-name">Campaign Name *</Label>
                        <Input
                            id="campaign-name"
                            placeholder="Campaign name"
                            value={campaignData.name}
                            onChange={(e) => {
                                setCampaignData({ ...campaignData, name: e.target.value });
                                setErrors({ ...errors, name: '' });
                            }}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="campaign-description">Description *</Label>
                        <Textarea
                            id="campaign-description"
                            placeholder="Campaign description..."
                            value={campaignData.description}
                            onChange={(e) => {
                                setCampaignData({ ...campaignData, description: e.target.value });
                                setErrors({ ...errors, description: '' });
                            }}
                            className={`min-h-[120px] resize-none ${errors.description ? 'border-red-500' : ''}`}
                        />
                        <div className="flex justify-between items-center">
                            {errors.description ? (
                                <p className="text-sm text-red-500">{errors.description}</p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    {campaignData.description.length} characters
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="campaign-goal">Funding Goal *</Label>
                        <Input
                            id="campaign-goal"
                            placeholder="€10,000"
                            value={campaignData.fundGoal}
                            onChange={(e) => {
                                const formatted = formatCurrency(e.target.value);
                                setCampaignData({ ...campaignData, fundGoal: formatted });
                                setErrors({ ...errors, fundGoal: '' });
                            }}
                            className={errors.fundGoal ? 'border-red-500' : ''}
                        />
                        {errors.fundGoal && (
                            <p className="text-sm text-red-500">{errors.fundGoal}</p>
                        )}
                        {!errors.fundGoal && campaignData.fundGoal && (
                            <p className="text-xs text-muted-foreground">
                                Target amount you want to raise
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="campaign-company">Company</Label>
                        <Input
                            id="campaign-company"
                            value={campaignData.companyId}
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                            Company is automatically assigned
                        </p>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        className="w-full mt-2"
                        disabled={createCampaign.isPending}
                    >
                        {createCampaign.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating campaign...
                            </>
                        ) : (
                            'Create Campaign'
                        )}
                    </Button>
                </div>

                <div className="mt-4 text-center text-xs text-gray-600">
                    By creating a campaign, you agree to our{' '}
                    <button className="text-blue-600 hover:underline">Campaign Guidelines</button>
                    {' '}and{' '}
                    <button className="text-blue-600 hover:underline">Terms of Service</button>
                </div>
            </CardContent>
        </Card>
    );
}