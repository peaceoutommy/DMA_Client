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

export default function CampaignCard({ campaign, variant = 'default' }) {
  const {
    id,
    name,
    description,
    startDate,
    endDate,
    status,
    fundGoal,
    raisedFunds,
    files = [],
    company
  } = campaign;

  const navigate = useNavigate();

  // Calculate funding percentage
  const fundingPercentage = Math.min((raisedFunds / fundGoal) * 100, 100);

  // Status badge variant helper
  const getStatusVariant = (status) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'COMPLETED': return 'secondary';
      case 'DRAFT': return 'outline';
      case 'CANCELLED': return 'destructive';
      default: return 'outline';
    }
  };

  // --- MINIMALISTIC / COMPACT VERSION ---
  if (variant === 'mini') {
    return (
      <Card
        className="group flex flex-row h-36 w-full overflow-hidden cursor-pointer p-4"
        onClick={() => navigate(`/campaigns/${id}`)}
      >
        {/* Left Side: Image */}
        <div className="w-32 shrink-0 bg-muted relative">
          {files.length > 0 ? (
            <img
              src={files[0].url}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
              <TrendingUp className="h-8 w-8" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <Badge
              variant={getStatusVariant(status)}
              className="h-5 px-1.5 text-[10px] backdrop-blur-md bg-background/80 shadow-sm"
            >
              {status}
            </Badge>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex flex-col flex-1 p-3 min-w-0 justify-between">
          {/* Header */}
          <div className="space-y-1">
            <h3
              className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors"
              title={name}
            >
              {name}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              {company && (
                <span className="flex items-center gap-1 truncate max-w-[120px]">
                  <Building2 className="h-3 w-3" />
                  {company.name}
                </span>
              )}
              <span className="flex items-center gap-1 whitespace-nowrap">
                <Calendar className="h-3 w-3" />
                {formatDate(endDate)}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <Progress value={fundingPercentage} className="h-1.5" />
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-medium text-primary">
                {fundingPercentage.toFixed(0)}%
              </span>
              <span className="text-muted-foreground">
                {formatCurrency(raisedFunds)} / {formatCurrency(fundGoal)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // --- DEFAULT FULL VERSION ---
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col group">
      {/* Campaign Image */}
      {files.length > 0 && (
        <div className="relative h-48 bg-muted shrink-0 overflow-hidden">
          <img
            src={files[0].url}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/campaigns/${campaign.id}`)}>
                  View Details
                </DropdownMenuItem>
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
            <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">{name}</CardTitle>
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

      <CardContent className="space-y-4 flex-1">
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
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t mt-auto">
        <Button onClick={() => navigate(`/campaigns/${campaign.id}`)} variant="default" className="w-full">
          View Campaign
        </Button>
      </CardFooter>
    </Card>
  );
}