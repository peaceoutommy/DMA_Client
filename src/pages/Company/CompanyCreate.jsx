import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useCreateCompany, useCompanyTypes } from '@/hooks/useCompany';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner"
import { useNavigate } from 'react-router-dom';

export default function CompanyCreate() {
    const createCompany = useCreateCompany();
    const { data, isLoading } = useCompanyTypes();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [companyData, setCompanyData] = useState({
        userId: null,
        name: '',
        typeId: null,
        registrationNumber: '',
        taxId: ''
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!companyData.name.trim()) {
            newErrors.name = 'Company name is required';
        } else if (companyData.name.trim().length < 3) {
            newErrors.name = 'Company name must be at least 3 characters';
        }

        if (!companyData.registrationNumber.trim()) {
            newErrors.registrationNumber = 'Registration number is required';
        } else if (companyData.registrationNumber.trim().length < 5) {
            newErrors.registrationNumber = 'Registration number must be at least 5 characters';
        }

        if (!companyData.taxId.trim()) {
            newErrors.taxId = 'Tax ID is required';
        } else if (companyData.taxId.trim().length < 5) {
            newErrors.taxId = 'Tax ID must be at least 5 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        toast.dismiss();
        toast.loading("Creating company...", {
            position: "top-center",
        })
        if (validateForm()) {
            const payload = {
                userId: user.id,
                name: companyData.name.trim(),
                typeId: companyData.typeId,
                registrationNumber: companyData.registrationNumber.trim(),
                taxId: companyData.taxId.trim()
            };

            createCompany.mutate(payload, {
                onSuccess: () => {
                    setCompanyData({
                        userId: null,
                        name: '',
                        typeId: null,
                        registrationNumber: '',
                        taxId: ''
                    });
                    setErrors({});
                    navigate('/not-approved')
                    toast.dismiss();
                    toast.success("Company created successfully", { position: "top-center" })
                },
                onError: (error) => {
                    toast.dismiss();
                    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        "Failed to create company";

                    toast.error("Failed to create company", {
                        position: "top-center",
                        description: errorMessage,
                    });
                }
            });
        }
    };

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <Card className="w-full max-w-md shadow-2xl border-0">
            <CardContent className="pb-4">
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name *</Label>
                        <Input
                            id="company-name"
                            placeholder="Enter company name"
                            value={companyData.name}
                            onChange={(e) => {
                                setCompanyData({ ...companyData, name: e.target.value });
                                setErrors({ ...errors, name: '' });
                            }}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company-registration">Registration Number *</Label>
                        <Input
                            id="company-registration"
                            placeholder="e.g., 12345678"
                            value={companyData.registrationNumber}
                            onChange={(e) => {
                                setCompanyData({ ...companyData, registrationNumber: e.target.value });
                                setErrors({ ...errors, registrationNumber: '' });
                            }}
                            className={errors.registrationNumber ? 'border-red-500' : ''}
                        />
                        {errors.registrationNumber && (
                            <p className="text-sm text-red-500">{errors.registrationNumber}</p>
                        )}
                        {!errors.registrationNumber && (
                            <p className="text-xs text-muted-foreground">
                                Official company registration number
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company-tax">Tax ID *</Label>
                        <Input
                            id="company-tax"
                            placeholder="e.g., NL123456789B01"
                            value={companyData.taxId}
                            onChange={(e) => {
                                setCompanyData({ ...companyData, taxId: e.target.value });
                                setErrors({ ...errors, taxId: '' });
                            }}
                            className={errors.taxId ? 'border-red-500' : ''}
                        />
                        {errors.taxId && (
                            <p className="text-sm text-red-500">{errors.taxId}</p>
                        )}
                        {!errors.taxId && (
                            <p className="text-xs text-muted-foreground">
                                Tax identification number
                            </p>
                        )}
                    </div>

                    {/* Company type dropdown */}
                    <div className="space-y-2">
                        <Label htmlFor="company-type">Company Type *</Label>
                        {isLoading ? (
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Loading types...
                            </div>
                        ) : (
                            <Select
                                value={String(companyData.typeId)}
                                onValueChange={(value) =>
                                    setCompanyData({ ...companyData, typeId: parseInt(value) })
                                }
                            >
                                <SelectTrigger id="company-type">
                                    <SelectValue placeholder="Select a company type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {data?.map((type) => (
                                        <SelectItem key={type.id} value={String(type.id)}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        className="w-full mt-2"
                        disabled={createCompany.isPending}
                    >
                        {createCompany.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating company...
                            </>
                        ) : (
                            'Create Company'
                        )}
                    </Button>
                </div>

                <div className="mt-4 text-center text-xs text-gray-600">
                    By creating a company, you agree to our{' '}
                    <button className="text-blue-600 hover:underline">Business Guidelines</button>
                    {' '}and{' '}
                    <button className="text-blue-600 hover:underline">Terms of Service</button>
                </div>
            </CardContent>
        </Card>
    );
}