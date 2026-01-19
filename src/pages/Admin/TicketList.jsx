import React from 'react';
import { useTickets } from '@/hooks/useTicket';
import { DataTable } from '@/components/Table/DataTable';
import { columnsTicket } from '@/components/Table/ColumnsTicket';
import { useAuth } from '@/context/AuthContext';


export default function TicketList() {
    const { user } = useAuth();
    const { data, isLoading } = useTickets();

    if (isLoading || !user) {
        return <div>Loading...</div>
    }

    return (
        <>
            <DataTable columns={columnsTicket} data={data} filterColumn="name" showSelected={false} />
        </>

    )
}