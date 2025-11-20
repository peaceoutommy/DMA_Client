import { DataTable } from "@/components/Table/DataTable";
import { columnsEmployee } from "@/components/Table/ColumnsEmployee";
import { useAuth } from "@/context/AuthContext";
import { useAddEmployee, useCompanyEmployee } from "@/hooks/useCompanyEmployee";
import { useCompanyRolePermissions } from "@/hooks/useCompanyRolePermission";
import { AddCompanyRoleModal } from "@/components/Modal/AddCompanyRoleModal";
import { useState } from "react";
import AddUserToCompanyModal from "@/components/Modal/AddUserToCompanyModal";
import { useCompanyRoles } from "@/hooks/useCompanyRole";
import { toast } from "sonner"

export default function Employee() {
    const { user } = useAuth();
    const companyId = user?.companyId;

    const { data: employeeData, isLoading: employeeIsLoading } = useCompanyEmployee(companyId);
    const { data: roleData, isLoading: roleIsLoading } = useCompanyRoles(companyId);

    const addEmployee = useAddEmployee();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [newItem, setNewItem] = useState(null);


    const handleAdd = () => {
        setIsAddModalOpen(true);
    }

    const handleEdit = () => {
        console.log('edit');
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
                columns={columnsEmployee(handleAdd, handleEdit)}
                data={employeeData || []}
                filterColumn="name"
                showSelected={false}
                onAdd={handleAdd}
                addText="Add Company Type"
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
        </>
    )
}