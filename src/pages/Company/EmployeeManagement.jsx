import { DataTable } from "@/components/Table/DataTable";
import { columnsEmployee } from "@/components/Table/ColumnsEmployee";
import { useAuth } from "@/context/AuthContext";
import { useAddEmployee, useCompanyEmployee, useRemoveEmployee } from "@/hooks/useCompanyEmployee";
import { useState } from "react";
import AddUserToCompanyModal from "@/components/Modal/AddUserToCompanyModal";
import RemoveEmployeeModal from "@/components/Modal/RemoveEmployeeModal"; // Import the new modal
import { useCompanyRoles } from "@/hooks/useCompanyRole";
import { toast } from "sonner"

export default function Employee() {
    const { user } = useAuth();
    const companyId = user?.companyId;

    const { data: employeeData, isLoading: employeeIsLoading } = useCompanyEmployee(companyId);
    const { data: roleData, isLoading: roleIsLoading } = useCompanyRoles(companyId);

    const addEmployee = useAddEmployee();
    const removeEmployee = useRemoveEmployee();

    // --- State Management ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState(null);

    // State for the item being removed
    const [itemToDelete, setItemToDelete] = useState(null);

    // --- Handlers ---

    const handleAdd = () => {
        setIsAddModalOpen(true);
    }

    const handleEdit = (row) => {
        console.log('edit', row);
        // Implement edit logic here if needed
    }

    // This opens the confirmation modal
    const handleDeleteClick = (row) => {
        setItemToDelete(row);
    }

    // This executes the actual remove mutation
    const handleConfirmRemove = () => {
        if (!itemToDelete) return;

        // 1. Construct the object to match the "Add" payload structure
        // We assume 'itemToDelete' (the row data) contains the necessary IDs.
        const payload = {
            companyId: companyId,
            employeeId: itemToDelete.id, // or itemToDelete.employeeId depending on your API response
            roleId: itemToDelete.roleId  // ensuring we pass the roleId if required by backend
        };

        toast.loading("Removing employee...", { id: "remove-toast" });

        removeEmployee.mutate(payload, {
            onSuccess: () => {
                toast.dismiss("remove-toast");
                toast.success("Employee removed successfully");
                setItemToDelete(null); // Close modal
            },
            onError: (error) => {
                toast.dismiss("remove-toast");
                const errorMessage = error.response?.data?.message ||
                    error.message ||
                    "Failed to remove employee";

                toast.error("Failed to remove employee", {
                    description: errorMessage
                });
            }
        });
    }

    const handleSubmitSave = () => {
        toast.dismiss();
        toast.loading("Adding employee to company...", {
            position: "top-center",
        })

        addEmployee.mutate(newItem, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setNewItem(null);
                toast.dismiss();
                toast.success("Employee added", { position: "top-center" })
            },
            onError: (error) => {
                toast.dismiss();
                const errorMessage = error.response?.data?.message ||
                    error.message ||
                    "Failed to add employee to company";

                toast.error("Failed to add employee to company", {
                    position: "top-center",
                    description: errorMessage,
                });
            }
        })
    }

    if (employeeIsLoading || !user || !companyId) {
        return <div>Loading...</div>
    }

    return (
        <>
            <DataTable
                columns={columnsEmployee(handleEdit, handleDeleteClick)}
                data={employeeData || []}
                filterColumn="name"
                showSelected={false}
                onAdd={handleAdd}
                addText="Add Employee" 
            />

            <AddUserToCompanyModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSubmitSave}
                newItem={newItem}
                setNewItem={setNewItem}
                roles={roleData}
                companyId={companyId}
            />

            <RemoveEmployeeModal
                open={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmRemove}
                item={itemToDelete}
            />
        </>
    )
}