import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Building2, TrendingUp, MoreVertical } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

export default function CampaignCard({ campaign }) {
  const {
    id,
    name,
    description,
    startDate,
    endDate,
    status,
    fundGoal,
    raisedFunds,
    images = [],
    company
  } = campaign;

  const navigate = useNavigate();

  // Calculate funding percentage
  const fundingPercentage = Math.min((raisedFunds / fundGoal) * 100, 100);

  // Status badge variant
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Campaign Image */}
      {images.length > 0 && (
        <div className="relative h-48 bg-muted">
          <img
            src={images[0]}
            alt={name}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/campaigns/${campaign.id}`)}>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete Campaign
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl line-clamp-1">{name}</CardTitle>
            {company && (
              <CardDescription className="flex items-center gap-1 mt-1">
                <Building2 className="h-3 w-3" />
                <span className="text-xs">{company.name}</span>
              </CardDescription>
            )}
          </div>
          <Badge variant={getStatusVariant(status)} className="shrink-0">
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Funding Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Funding Progress</span>
            </div>
            <span className="font-semibold">
              {fundingPercentage.toFixed(0)}%
            </span>
          </div>
          <Progress value={fundingPercentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(raisedFunds)} raised</span>
            <span>Goal: {formatCurrency(fundGoal)}</span>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <Button onClick={() => navigate(`/campaigns/${campaign.id}`)} variant="default" className="w-full">
          View Campaign
        </Button>
      </CardFooter>
    </Card>
  );
}