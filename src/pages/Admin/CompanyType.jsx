import React, { useEffect, useState } from 'react';
import { useCompanyTypes, useCreateCompanyType, useUpdateCompanyType, useDeleteCompanyType } from '@/hooks/useCompany';
import { DataTable } from '@/components/Table/DataTable';
import { DeleteModal } from '@/components/Modal/DeleteModal';
import { columnsCompanyType } from '@/components/Table/ColumnsCompanyType';
import { AddCompanyTypeModal } from '@/components/Modal/AddCompanyTypeModal';

export default function CompanyType() {
    const { data, isLoading } = useCompanyTypes();
    const createCompanyType = useCreateCompanyType();
    const updateCompanyType = useUpdateCompanyType();
    const deleteCompanyType = useDeleteCompanyType();

    const [editingItem, setEditingItem] = useState(null);
    const [newItem, setNewItem] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleAdd = () => {
        setIsAddModalOpen(true);
    }

    const handleSubmitSave = () => {
        createCompanyType.mutate(newItem, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setNewItem(null);
            },
        });
    }

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleSubmitEdit = (item) => {
        if (!item.name?.trim()) return;

        updateCompanyType.mutate(item, {
            onSuccess: () => setEditingItem(null),
        });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
    };

    const handleDelete = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedItem) {
            deleteCompanyType.mutate(selectedItem.id, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedItem(null);
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
                columns={columnsCompanyType(
                    handleEdit,
                    handleDelete,
                    editingItem,
                    setEditingItem,
                    handleSubmitEdit,
                    handleCancelEdit
                )}
                data={data || []}
                filterColumn="name"
                showSelected={false}
                onAdd={handleAdd}
                addText="Add Company Type"
            />

            <AddCompanyTypeModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSubmitSave}
                newItem={newItem}
                setNewItem={setNewItem}
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