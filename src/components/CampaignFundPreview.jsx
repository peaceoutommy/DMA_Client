import React from 'react';
import { Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/currency';

export default function CampaignFundPreview({ campaign, onRequestFunding }) {
    const fundingPercentage = Math.min((campaign.raisedFunds / campaign.fundGoal) * 100, 100);

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

    if(!campaign){
        return Loading
    }

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-1">{campaign.name}</CardTitle>
                        {campaign && (
                            <CardDescription className="flex items-center gap-1 mt-1">
                                <Building2 className="h-3 w-3" />
                                <span className="text-xs">{campaign.name}</span>
                            </CardDescription>
                        )}
                    </div>
                    <Badge variant={getStatusVariant(campaign.status)} className="shrink-0">
                        {campaign.status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Funding Progress</span>
                        <span className="font-medium">{fundingPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${fundingPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Fund Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Raised</p>
                        <p className="font-semibold text-sm">{formatCurrency(campaign.raisedFunds)}</p>
                    </div>
                    <div className="space-y-1 border-l border-r">
                        <p className="text-xs text-muted-foreground">Available</p>
                        <p className="font-semibold text-sm">{formatCurrency(campaign.availableFunds)}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className="font-semibold text-sm">{formatCurrency(campaign.remainingFunds)}</p>
                    </div>
                </div>

                {/* Request Funding Button */}
                <Button
                    onClick={() => onRequestFunding(campaign)}
                    className="w-full"
                    size="sm"
                >
                    Request Funding
                </Button>
            </CardContent>
        </Card>
    );
}
