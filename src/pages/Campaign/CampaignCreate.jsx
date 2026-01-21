import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/currency';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CampaignCreate() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const createCampaign = useCreateCampaign();
    const [newItem, setnewItem] = useState(null);
    const [images, setImages] = useState([]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        const availableSlots = 5 - images.length;
        const filesToAdd = files.slice(0, availableSlots);

        const newImages = filesToAdd.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...newImages]);
        e.target.value = '';
    };

    const removeImage = (index) => {
        // Revoke the object URL to free memory
        URL.revokeObjectURL(images[index].preview);
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // Add cleanup on component unmount or successful submission
    useEffect(() => {
        return () => {
            images.forEach(image => URL.revokeObjectURL(image.preview));
        };
    }, [images]);


    const handleSubmit = () => {
        toast.dismiss();
        toast.loading("Creating campaign...", { position: "top-center" });

        const formData = new FormData();
        formData.append('name', newItem.name.trim());
        formData.append('description', newItem.description.trim());
        formData.append('fundGoal', parseFloat(newItem.fundGoal.replace(/[^0-9]/g, '')));
        formData.append('companyId', user.companyId);

        if (newItem.startDate) {
            formData.append('startDate', format(newItem.startDate, 'yyyy-MM-dd'));
        }
        if (newItem.endDate) {
            formData.append('endDate', format(newItem.endDate, 'yyyy-MM-dd'));
        }

        images.forEach((image, index) => {
            formData.append('images', image.file);
        });

        createCampaign.mutate(formData, {
            onSuccess: (data) => {
                setnewItem(null);
                setImages([]);
                toast.dismiss();
                toast.success("Campaign created successfully!", { position: "top-center" });
                navigate(`/campaigns/${data.id}`)
            },
            onError: () => {
                toast.dismiss();
                toast.error("Failed to create campaign", { position: "top-center" });
            }
        });
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

            <div className="gap-6">
                {/* Main Form */}
                <div className="space-y-6">
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
                                    data-test="campaign-name"
                                    placeholder="e.g., Clean Water Initiative"
                                    value={newItem?.name || ''}
                                    onChange={(e) => {
                                        setnewItem({ ...newItem, name: e.target.value });
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="campaign-description">Description *</Label>
                                <Textarea
                                    id="campaign-description"
                                    data-test="campaign-description"
                                    placeholder="Describe your campaign goals, impact, and why people should support it..."
                                    value={newItem?.description || ''}
                                    onChange={(e) => {
                                        setnewItem({ ...newItem, description: e.target.value });
                                    }}
                                />
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-muted-foreground">
                                        {newItem?.description?.length} characters (minimum 20)
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>
                                This is how your description will appear
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}

                            >
                                {newItem?.description || '*Start typing to see a preview...*'}
                            </ReactMarkdown>
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
                                    data-test="campaign-goal"
                                    placeholder="€10,000"
                                    value={newItem?.fundGoal || ''}
                                    onChange={(e) => {
                                        const formatted = formatCurrency(e.target.value);
                                        setnewItem({ ...newItem, fundGoal: formatted });
                                    }}
                                />
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
                                                    !newItem?.startDate && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {newItem?.startDate ? format(newItem?.startDate, "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={newItem?.startDate}
                                                onSelect={(date) => {
                                                    setnewItem({ ...newItem, startDate: date });
                                                }}
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !newItem?.endDate && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {newItem?.endDate ? format(newItem?.endDate, "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={newItem?.endDate}
                                                onSelect={(date) => {
                                                    setnewItem({ ...newItem, endDate: date });
                                                }}
                                                disabled={(date) => date < (newItem?.startDate || new Date())}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
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

                            <Button onClick={handleSubmit} data-test="campaign-submit" disabled={createCampaign.isPending}>
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
            </div>
        </div>
    );
}