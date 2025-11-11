import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Target, Calendar as CalendarIcon, Building2, Upload, X } from 'lucide-react';
import { useCreateCampaign } from '@/hooks/useCampaign';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useCompany } from '@/hooks/useCompany';
import { useNavigate } from 'react-router-dom';

export default function CampaignCreate() {
    const createCampaign = useCreateCampaign();
    const { user } = useAuth();
    const { data: companyData, loading: companyLoading } = useCompany(user?.companyId);
    const navigate = useNavigate();

    const [campaignData, setCampaignData] = useState(null);

    const [images, setImages] = useState([]);
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

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
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
            newErrors.fundGoal = 'Funding goal must be at least €100';
        }

        if (campaignData.startDate && campaignData.endDate < campaignData.startDate) {
            newErrors.endDate = 'End date must be after start date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            toast.loading("Creating campaign...", { id: "loadingToast", position: "top-center" });

            const payload = {
                name: campaignData.name.trim(),
                description: campaignData.description.trim(),
                fundGoal: parseFloat(campaignData.fundGoal.replace(/[^0-9]/g, '')),
                companyId: user.companyId,
                startDate: campaignData.startDate,
                endDate: campaignData.endDate,
                // Add images handling when backend supports it
            };

            createCampaign.mutate(payload, {
                onSuccess: () => {
                    setCampaignData(null);
                    setImages([]);
                    setErrors({});
                    toast.success("Campaign created successfully!", { id: "loadingToast", position: "top-center" });
                },
                onError: () => {
                    toast.error("Failed to create campaign", { id: "loadingToast", position: "top-center" });
                }
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Campaign</h1>
                <p className="text-muted-foreground mt-1">
                    Set up a new fundraising campaign for your organization
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Provide the essential details about your campaign
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="campaign-name">Campaign Name *</Label>
                                <Input
                                    id="campaign-name"
                                    placeholder="e.g., Clean Water Initiative"
                                    value={campaignData?.name || ''}
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
                                    placeholder="Describe your campaign goals, impact, and why people should support it..."
                                    value={campaignData?.description || ''}
                                    onChange={(e) => {
                                        setCampaignData({ ...campaignData, description: e.target.value });
                                        setErrors({ ...errors, description: '' });
                                    }}
                                    className={`min-h-[150px] resize-none ${errors.description ? 'border-red-500' : ''}`}
                                />
                                <div className="flex justify-between items-center">
                                    {errors.description ? (
                                        <p className="text-sm text-red-500">{errors.description}</p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">
                                            {campaignData?.description?.length} characters (minimum 20)
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Funding & Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Funding & Timeline</CardTitle>
                            <CardDescription>
                                Set your fundraising goal and campaign duration
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="campaign-goal" className="flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    Funding Goal *
                                </Label>
                                <Input
                                    id="campaign-goal"
                                    placeholder="€10,000"
                                    value={campaignData?.fundGoal || ''}
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
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !campaignData?.startDate && "text-muted-foreground",
                                                    errors.startDate && "border-red-500"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {campaignData?.startDate ? format(campaignData?.startDate, "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={campaignData?.startDate}
                                                onSelect={(date) => {
                                                    setCampaignData({ ...campaignData, startDate: date });
                                                    setErrors({ ...errors, startDate: '' });
                                                }}
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.startDate && (
                                        <p className="text-sm text-red-500">{errors.startDate}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !campaignData?.endDate && "text-muted-foreground",
                                                    errors.endDate && "border-red-500"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {campaignData?.endDate ? format(campaignData?.endDate, "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={campaignData?.endDate}
                                                onSelect={(date) => {
                                                    setCampaignData({ ...campaignData, endDate: date });
                                                    setErrors({ ...errors, endDate: '' });
                                                }}
                                                disabled={(date) => date < (campaignData?.startDate || new Date())}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.endDate && (
                                        <p className="text-sm text-red-500">{errors.endDate}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaign Images</CardTitle>
                            <CardDescription>
                                Upload images to showcase your campaign (optional, max 5)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                                            <img
                                                src={image.preview}
                                                alt={`Upload ${index + 1}`}
                                                className="object-cover w-full h-full"
                                            />
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="absolute top-2 right-2 h-6 w-6"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    {images.length < 5 && (
                                        <label className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                                            <Upload className="h-8 w-8 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Upload Image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    <div>
                        {/* Action Buttons */}
                        <div className='flex  gap-2 justify-end'>
                            <Button variant="outline" onClick={() => window.history.back()}>
                                Cancel
                            </Button>

                            <Button onClick={handleSubmit} disabled={createCampaign.isPending}>
                                {createCampaign.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Campaign'
                                )}
                            </Button>
                        </div>

                        {/* Guidelines */}

                        <p className="text-xs text-muted-foreground text-center pt-4">
                            By creating a campaign, you agree to our{' '}
                            <button onClick={() => navigate("/tos")} className="text-primary hover:underline cursor-pointer">Terms of Service</button>
                        </p>

                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Company Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Organization
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                    value={companyData?.name || 'Not assigned'}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Campaign will be created under your organization
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}