import { DataTable } from "@/components/Table/DataTable";
import { columnsEmployee } from "@/components/Table/ColumnsEmployee";
import { useAuth } from "@/context/AuthContext";
import { useCompanyEmployee } from "@/hooks/useCompanyEmployee";
import { useCompanyRolePermissions } from "@/hooks/useCompanyRolePermission";
import { AddCompanyRoleModal } from "@/components/Modal/AddCompanyRoleModal";
import { useState } from "react";

export default function Employee() {
    const { user } = useAuth();
    const companyId = user?.companyId;

    const { data: employeeData, isLoading: employeeIsLoading } = useCompanyEmployee(companyId);
    console.log(employeeData)

    const handleAdd = () => {
        console.log('add');
    }

    const handleEdit = () => {
        console.log('edit');
    }


    if (employeeIsLoading || !user || !companyId) {
        return <div>Loading...</div>
    }

    console.log(employeeData);

    return (
        <>
            <DataTable
                columns={columnsEmployee(handleAdd, handleEdit)}
                data={employeeData || []}
                filterColumn="name"
                showSelected={false}
                onAdd={handleAdd}
                addText="Add Company Type"
            />
            
        </>
    )
}