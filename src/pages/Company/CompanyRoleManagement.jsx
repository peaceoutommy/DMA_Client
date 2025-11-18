import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext"
import { useCompanyRoles, useCreateCompanyRole, useDeleteCompanyRole, useUpdateCompanyRole } from '@/hooks/useCompanyRole';
import { useCompanyRolePermissions } from '@/hooks/useCompanyRolePermission';
import { AddCompanyRoleModal } from '@/components/Modal/AddCompanyRoleModal';
import { columnsCompanyRole } from '@/components/Table/ColumnsCompanyRole';
import { DataTable } from "@/components/Table/DataTable"
import { DeleteModal } from '@/components/Modal/DeleteModal';
import { toast } from "sonner"
import { EditCompanyRoleModal } from '@/components/Modal/EditCompanyRoleModal';

export default function CompanyRoleManagement() {
    const { user } = useAuth();
    const companyId = user?.companyId;

    const { data: companyRolesData, isLoading: companyRolesLoading } = useCompanyRoles(companyId);
    const createRole = useCreateCompanyRole();
    const deleteRole = useDeleteCompanyRole();
    const updateRole = useUpdateCompanyRole();

    const { data: permissionData, isLoading: permissionIsLoading } = useCompanyRolePermissions();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [newItem, setNewItem] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);


    const handleAdd = () => {
        setIsAddModalOpen(true);
    }

    const handleEdit = (role) => {
        const roleWithPermIds = replacePermissionObjectsByIds(role);
        setEditItem(roleWithPermIds);
        setIsEditModalOpen(true);
    }

    const handleDelete = (role) => {
        setSelectedItem(role)
        setIsDeleteModalOpen(true);
    }

    const handleSubmitSave = () => {
        toast.dismiss();
        toast.loading("Adding role...", {
            position: "top-center",
        })

        createRole.mutate(newItem, {
            onSuccess: () => {
                toast.dismiss();
                toast.success("Role added", { position: "top-center" })
                setIsAddModalOpen(false);
                setNewItem(null);
            },
            onError: () => {
                toast.dismiss();
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

    const handleSubmitEdit = () => {
        toast.dismiss();
        toast.loading("Updating role...", { position: "top-center" })
        if (editItem) {
            updateRole.mutate(editItem, {
                onSuccess: () => {
                    toast.dismiss();
                    toast.success("Role updated", { position: "top-center" })
                    setIsEditModalOpen(false);
                    setEditItem(null);
                },
                onError: (error) => {
                    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        "Failed to update role";

                    toast.dismiss();
                    toast.error("Failed to update role", {
                        position: "top-center",
                        description: errorMessage,
                    });
                }
            })
        }
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

    const replacePermissionObjectsByIds = (item) => {
        const permissionIds = item?.permissions?.map(perm => perm.id) || [];
        return {
            id: item.id,
            name: item.name,
            companyId: item.companyId,
            permissionIds: permissionIds
        };
    }

    if (companyRolesLoading || permissionIsLoading || !user) {
        return <div>Loading...</div>
    }

    return (
        <>
            <DataTable
                columns={columnsCompanyRole(handleEdit, handleDelete)}
                data={companyRolesData || []}
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

            <EditCompanyRoleModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSubmitEdit}
                editItem={editItem}
                setEditItem={setEditItem}
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