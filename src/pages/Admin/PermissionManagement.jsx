import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCompanyRolePermissions, useCreateCompanyRolePermission } from "@/hooks/useCompanyRolePermission";
import { DataTable } from "@/components/Table/DataTable";
import { columnsPermission } from "@/components/Table/ColumnsPermission";
import { AddPermissionModal } from "@/components/Modal/AddPermissionModal";

export default function PermissionManagement() {
    const { user } = useAuth();
    const { data, isLoading, error } = useCompanyRolePermissions();
    const createPermissionMutation = useCreateCompanyRolePermission();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState(null);

    if (isLoading || !user) {
        return <div>Loading...</div>
    }

    const handleAdd = () => {
        setIsAddModalOpen(true);
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
                data={data || []}
                filterColumn="name"
                showSelected={false}
                onAdd={handleAdd}
                addText="Add Company Type"
            />
            <AddPermissionModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSubmitSave}
                newItem={newItem}
                setNewItem={setNewItem}
            />
        </>
    );
}