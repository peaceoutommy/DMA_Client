import React, { useState } from 'react';
import { useCompanyTypes, useCreateCompanyType } from '@/hooks/useCompany';
import { DataTable } from '@/components/Table/DataTable';
import { columnsCompanyType } from '@/components/Table/ColumnsCompanyType';

export default function CompanyType() {
    const { data, isLoading } = useCompanyTypes();
    const createCompanyType = useCreateCompanyType();

    const [companyTypeData, setCompanyTypeData] = useState('');
    const [errors, setErrors] = useState({});

    console.log(data)

    const validateForm = () => {
        const newErrors = {};

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const payload = {
                name: companyData.name.trim(),
            };

            createCompanyType.mutate(payload, {
                onSuccess: () => {
                    setCompanyTypeData('');
                    setErrors({});

                    setTimeout(() => {
                        createCompanyType.reset();
                    }, 3000);
                },
            });
        }
    };

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <DataTable columns={columnsCompanyType} data={data} filterColumn="name" showSelected={false} />
    );
}