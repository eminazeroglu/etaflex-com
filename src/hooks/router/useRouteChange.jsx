import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useContextModal } from "@/contexts/ModalContext.jsx";
import { appActions } from "@/store/actions/appAction.jsx";

export const useRouteChange = () => {
    const { pathname } = useLocation();
    const modalContext = useContextModal()

    useEffect(() => {
        if (modalContext && modalContext.closeAllModal) {
            modalContext.closeAllModal();
        }
        appActions.setErrors({})
    }, [pathname]);
};