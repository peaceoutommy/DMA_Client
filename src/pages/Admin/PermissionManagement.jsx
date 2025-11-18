import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCompanyRolePermissions, useCompanyRolePermissionTypes, useCreateCompanyRolePermission, useDeleteCompanyRolePermission, useUpdateCompanyRolePermission } from "@/hooks/useCompanyRolePermission";
import { toast } from "sonner"
import { DataTable } from "@/components/Table/DataTable";
import { DeleteModal } from "@/components/Modal/DeleteModal";
import { columnsPermission } from "@/components/Table/ColumnsPermission";
import { AddPermissionModal } from "@/components/Modal/AddPermissionModal";
import { EditPermissionModal } from "@/components/Modal/EditPermissionModal";

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
    const updatePermissionMutation = useUpdateCompanyRolePermission();
    const deletePermissionMutation = useDeleteCompanyRolePermission();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newItem, setNewItem] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    if (isPermissionsLoading || isTypesLoading || !user) {
        return <div>Loading...</div>
    }

    const handleAdd = () => {
        setIsAddModalOpen(true);
    }

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setNewItem(null);
    }

    const handleSubmitSave = () => {
        toast.loading("Adding permission...", { id: "loadingToast", position: "top-center" })
        createPermissionMutation.mutate(newItem, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setNewItem(null);
                toast.success("Permission added", { id: "loadingToast", position: "top-center" })
            },
            onError: (error) => {
                const errorMessage = error.response?.data?.message ||
                    error.message ||
                    "Failed to add permission";

                toast.error("Failed to add permission", {
                    id: loadingToast,
                    position: "top-center",
                    description: errorMessage,
                });
            }
        });
    }

    const handleEdit = (item) => {
        setIsEditModalOpen(true);
        setEditItem(item);
    }

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditItem(null);
    }

    const handleSubmitEditSave = () => {
        if (!editItem.name?.trim()) return;
        toast.loading("Updating permission...", { id: "loadingToast", position: "top-center" })

        updatePermissionMutation.mutate(editItem, {
            onSuccess: () => {
                setEditItem(null);
                setIsEditModalOpen(false);
                toast.success("Permission updated", { id: "loadingToast", position: "top-center" })
            },
            onError: (error) => {
                const errorMessage = error.response?.data?.message ||
                    error.message ||
                    "Failed to update permission";

                toast.error("Failed to update permission", {
                    id: loadingToast,
                    position: "top-center",
                    description: errorMessage,
                });
            }
        });
    }

    const handleDelete = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    }

    const confirmDelete = () => {
        if (selectedItem) {
            toast.loading("Deleting permission...", { id: "loadingToast", position: "top-center" })
            deletePermissionMutation.mutate(selectedItem.id, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedItem(null);
                    toast.success("Permission has been deleted", { id: "loadingToast", position: "top-center" })
                },
                onError: (error) => {
                const errorMessage = error.response?.data?.message ||
                    error.message ||
                    "Failed to delete permission";

                toast.error("Failed to delete permission", {
                    id: loadingToast,
                    position: "top-center",
                    description: errorMessage,
                });
            }
            });
        }
    }

    return (
        <>
            <DataTable
                columns={columnsPermission(
                    handleEdit,
                    handleDelete,
                )}
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
            <EditPermissionModal
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSubmitEditSave}
                editItem={editItem}
                setEditItem={setEditItem}
                types={typesData}
            />
            <DeleteModal
                open={isDeleteModalOpen}
                item={selectedItem}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={confirmDelete}
            />
        </>
    );
}