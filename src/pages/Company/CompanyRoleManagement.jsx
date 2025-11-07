import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext"
import { useCompanyRoles, useCreateCompanyRole, useDeleteCompanyRole } from '@/hooks/useCompanyRole';
import { useCompanyRolePermissions } from '@/hooks/useCompanyRolePermission';
import { AddCompanyRoleModal } from '@/components/Modal/AddCompanyRoleModal';
import { columnsCompanyRole } from '@/components/Table/ColumnsCompanyRole';
import { DataTable } from "@/components/Table/DataTable"
import { DeleteModal } from '@/components/Modal/DeleteModal';
import { toast } from "sonner"

export default function CompanyRoleManagement() {
    const { user } = useAuth();
    const companyId = user?.companyId;

    const { data, isLoading } = useCompanyRoles(companyId);
    const createRole = useCreateCompanyRole();
    const deleteRole = useDeleteCompanyRole();
    const { data: permissionData, isLoading: permissioIsLoading } = useCompanyRolePermissions();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [newItem, setNewItem] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);


    const handleAdd = () => {
        setIsAddModalOpen(true);
    }

    const handleEdit = (item) => {
        console.log("Edit role", item);
    }

    const handleDelete = (item) => {
        setSelectedItem(item)
        setIsDeleteModalOpen(true);
    }

    const handleSubmitSave = () => {
        toast.dismiss();
        toast.loading("Adding role...", {
            position: "top-center",
        })

        const roles = replacePermissionIdsByObjects();

        createRole.mutate(roles, {
            onSuccess: () => {
                toast.dismiss();
                toast.success("Role added", { position: "top-center" })
                setIsAddModalOpen(false);
                setNewItem(null);
            },
            onError: () => {
                toast.dismiss;
                const errorMessage = error.response?.data?.message ||
                    error.message ||
                    "Failed to add role";

                toast.error("Failed to add role", {
                    position: "top-center",
                    description: errorMessage,
                });
            }
        })

    }

    const confirmDelete = () => {
        toast.dismiss();
        toast.loading("Deleting role...", {
            position: "top-center",
        })

        if (selectedItem) {
            deleteRole.mutate(selectedItem, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedItem(null);

                    toast.dismiss();
                    toast.success("Role has been deleted", {
                        position: "top-center",
                    })
                },
                onError: (error) => {

                    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        "Failed to delete role";

                    toast.dismiss();
                    toast.error("Failed to delete role", {
                        position: "top-center",
                        description: errorMessage,
                    });
                }
            });
        }
    }

    const replacePermissionIdsByObjects = () => {
        const permissionObjects = newItem?.permissionIds?.map(permId =>
            permissionData.find(p => p.id === permId)
        ).filter(Boolean) || [];

        const roles = {
            ...newItem,
            permissions: permissionObjects
        };
        return roles;
    }

    if (isLoading || !user) {
        return <div>Loading...</div>
    }

    return (
        <>
            <DataTable
                columns={columnsCompanyRole(handleEdit, handleDelete)}
                data={data || []}
                filterColumn="name"
                showSelected={false}
                onAdd={handleAdd}
                addText="Add Company Type"
            />

            <AddCompanyRoleModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSubmitSave}
                newItem={newItem}
                setNewItem={setNewItem}
                permissions={permissionData}
                companyId={companyId}
            />

            <DeleteModal
                open={isDeleteModalOpen}
                item={selectedItem}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={confirmDelete}
            />
        </>
    )
}