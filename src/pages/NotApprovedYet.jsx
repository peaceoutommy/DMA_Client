import React from 'react';
import { useAuth } from "@/context/AuthContext"


export default function NotApprovedYet() {
    const { user } = useAuth();
    console.log(user);

    return (
        <>
            <span>hello</span>
        </>
    )
}