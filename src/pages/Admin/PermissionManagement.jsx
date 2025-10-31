import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCompanyRolePermissions, useCompanyRolePermissionTypes, useCreateCompanyRolePermission, useDeleteCompanyRolePermission, useUpdateCompanyRolePermission } from "@/hooks/useCompanyRolePermission";
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
        createPermissionMutation.mutate(newItem, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setNewItem(null);
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

        updatePermissionMutation.mutate(editItem, {
            onSuccess: () => {
                setEditItem(null);
                setIsEditModalOpen(false);
            }
        });
    }

    const handleDelete = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    }

    const confirmDelete = () => {
        if (selectedItem) {
            deletePermissionMutation.mutate(selectedItem.id, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedItem(null);
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