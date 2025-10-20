import { useCompanies } from "@/hooks/useCompany"
import { DataTable } from "@/components/Table/DataTable"
import { columnsCompany } from "@/components/Table/ColumnsCompany"

export default function CompanyList() {

    const { data, isLoading } = useCompanies();

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <DataTable columns={columnsCompany} data={data} filterColumn="name" showSelected={false} />
        </>
    )
}