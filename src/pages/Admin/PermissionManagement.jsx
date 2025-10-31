import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCompanyRolePermissions, useCompanyRolePermissionTypes, useCreateCompanyRolePermission } from "@/hooks/useCompanyRolePermission";
import { DataTable } from "@/components/Table/DataTable";
import { columnsPermission } from "@/components/Table/ColumnsPermission";
import { AddPermissionModal } from "@/components/Modal/AddPermissionModal";

export default function PermissionManagement() {
    const { user } = useAuth();
    const {
        data: permissionsData,
        isLoading: isPermissionsLoading,
        error: permissionsError
    } = useCompanyRolePermissions();

    const {
        data: typesData,
        isLoading: isTypesLoading,
        error: typesError
    } = useCompanyRolePermissionTypes();

    const createPermissionMutation = useCreateCompanyRolePermission();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState(null);

    if (isPermissionsLoading || isTypesLoading || !user) {
        return <div>Loading...</div>
    }

    const handleAdd = () => {
        setIsAddModalOpen(true);
    }

     const handleCloseAddModal = () =>{
        setIsAddModalOpen(false);
        setNewItem(null);
    }

    const handleSubmitSave = () => {
        createPermissionMutation.mutate(newItem, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setNewItem(null);
            }
        });
    }

    return (
        <>
            <DataTable
                columns={columnsPermission}
                data={permissionsData || []}
                filterColumn="name"
                showSelected={false}
                onAdd={handleAdd}
                addText="Add Company Type"
            />
            <AddPermissionModal
                open={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSave={handleSubmitSave}
                newItem={newItem}
                setNewItem={setNewItem}
                types={typesData}
            />
        </>
    );
}