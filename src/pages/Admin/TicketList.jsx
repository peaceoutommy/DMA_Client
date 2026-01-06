import React from 'react';
import { useTickets } from '@/hooks/useTicket';
import { DataTable } from '@/components/Table/DataTable';
import { columnsTicket } from '@/components/Table/ColumnsTicket';

export default function TicketList() {

    const { data, isLoading } = useTickets();

    if (isLoading) {
        return <div>Loading...</div>
    }
    console.log(data)
    return(
        <>
            <DataTable columns={columnsTicket} data={data} filterColumn="name" showSelected={false} />
        </>

    )
}