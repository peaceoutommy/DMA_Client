import React from 'react';
import { useAuth } from "@/context/AuthContext"
import { useCompanyRoles, useCreateCompanyRole } from '@/hooks/useCompanyRole';
import { columnsCompanyRole } from '@/components/Table/ColumnsCompanyRole';
import { DataTable } from "@/components/Table/DataTable"

export default function CompanyRoleManagement() {
    const { user } = useAuth();
    const companyId = user?.companyId;
    const { data, isLoading } = useCompanyRoles(companyId);
    const createRole = useCreateCompanyRole();


    const handleAdd = () => {
        console.log("Add role");
    }

    if (isLoading || !user) {
        return <div>Loading...</div>
    }

    return (
        <>
            <DataTable
                columns={columnsCompanyRole}
                data={data}
                filterColumn="name"
                showSelected={false}
                onAdd={handleAdd}
                addText="Add Company Type"
            />
        </>
    )
}

