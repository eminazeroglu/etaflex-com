import React from 'react';
import {useAuthStore} from "@/hooks/store/useStore.jsx";
import {Navigate} from "react-router";

function GuestMiddleware({children}) {

    const {token} = useAuthStore();

    console.log(token);

    if (token) {
        return <Navigate to={'/'} />
    }

    return children;
}

export default GuestMiddleware;