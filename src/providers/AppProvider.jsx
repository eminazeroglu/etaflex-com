import React, {useCallback, useEffect, useState} from 'react';
import {useAuthStore, useUiStore} from "@/hooks/store/useStore.jsx";
import {createHashRouter, RouterProvider} from "react-router";
import {getRoutes} from "@/routes/index.jsx";
import {Loading} from "@/components/ui/index.jsx";
import {ModalContextProvider} from "@/contexts/ModalContext.jsx";

function AppProvider(props) {

    const { role } = useAuthStore();
    const { loading } = useUiStore();
    const [router, setRouter] = useState(null);

    const initRouter = useCallback(async () => {
        try {
            const routes = await getRoutes(role);
            if (routes?.length) {
                const newRouter = createHashRouter(routes);
                setRouter(newRouter);
            }
        } catch (error) {
            console.error(error.message);
        }
    }, [role]);

    useEffect(() => {
        initRouter();
    }, [initRouter]);

    if (!router || loading) {
        return <Loading fullScreen loading={true} />;
    }



    return (
        <ModalContextProvider>
            {router && <RouterProvider router={router} />}
        </ModalContextProvider>
    );
}

export default AppProvider;