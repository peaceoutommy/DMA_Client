import React, { useEffect, useState } from 'react';
import { useCompanyTypes, useCreateCompanyType, useUpdateCompanyType, useDeleteCompanyType } from '@/hooks/useCompany';
import { DataTable } from '@/components/Table/DataTable';
import { DeleteModal } from '@/components/Modal/DeleteModal';
import { columnsCompanyType } from '@/components/Table/ColumnsCompanyType';
import { AddCompanyTypeModal } from '@/components/Modal/AddCompanyTypeModal';
import { EditCompanyTypeModal } from '@/components/Modal/EditCompanyTypeModal';
import { toast } from "sonner"

export default function CompanyType() {
    const { data, isLoading } = useCompanyTypes();
    const createCompanyType = useCreateCompanyType();
    const updateCompanyType = useUpdateCompanyType();
    const deleteCompanyType = useDeleteCompanyType();

    const [editItem, setEditItem] = useState(null);
    const [newItem, setNewItem] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleAdd = () => {
        setIsAddModalOpen(true);
    }

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setNewItem(null);
    }

    const handleSubmitSave = () => {
        toast.loading("Adding company type...", { id: "loadingToast", position: "top-center" })
        createCompanyType.mutate(newItem, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setNewItem(null);
                toast.success("Company type added", { id: "loadingToast", position: "top-center" })
            },
        });
    }

    const handleEdit = (item) => {
        setIsEditModalOpen(true);
        setEditItem(item);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditItem(null);
    }

    const handleSubmitEdit = () => {
        if (!editItem.name?.trim()) return;
        toast.loading("Updating company type...", { id: "loadingToast", position: "top-center" })

        updateCompanyType.mutate(editItem, {
            onSuccess: () => {
                setEditItem(null);
                setIsEditModalOpen(false);
                toast.success("Company type updated", { id: "loadingToast", position: "top-center" })
            }
        });
    };

    const handleDelete = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        toast.loading("Deleting company type...", { id: "loadingToast", position: "top-center" })
        if (selectedItem) {
            deleteCompanyType.mutate(selectedItem.id, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedItem(null);
                    toast.success("Company type deleted", { id: "loadingToast", position: "top-center" })
                },
            });
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <DataTable
                columns={
                    columnsCompanyType(
                        handleEdit,
                        handleDelete,
                    )}
                data={data || []}
                filterColumn="name"
                showSelected={false}
                onAdd={handleAdd}
                addText="Add Company Type"
            />

            <AddCompanyTypeModal
                open={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSave={handleSubmitSave}
                newItem={newItem}
                setNewItem={setNewItem}
            />

            <EditCompanyTypeModal
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSubmitEdit}
                editItem={editItem}
                setEditItem={setEditItem}
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