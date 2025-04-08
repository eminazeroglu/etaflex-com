import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {getAvailableModalNames, getModalComponent} from '@/utils/modalUtil.jsx';
import ModalContainer from "@/modals/ModalContainer";

const ModalContext = createContext(null);

export const ModalContextProvider = ({children}) => {
    const [modals, setModals] = useState([]);
    const [availableModals, setAvailableModals] = useState([]);

    useEffect(() => {
        setAvailableModals(getAvailableModalNames());
    }, []);

    const openModal = useCallback(async (name, props = {}) => {
        const id = Date.now();
        const ModalComponent = await getModalComponent(name);
        if (ModalComponent) {
            setModals(prevModals => [...prevModals, {id, name, props, Component: ModalComponent}]);
            return id;
        } else { 
            console.warn(`Modal component for name ${name} not found.`);
            return null;
        }
    }, []); // getModalComponent dependency-ni silək

    const closeModal = useCallback((id) => {
        setModals(prevModals => prevModals.filter(modal => modal.id !== id));
    }, []);

    const closeAllModal = useCallback(() => {
        setModals([]);
    }, []);

    const values = React.useMemo(() => ({
        modals,
        openModal,
        closeModal,
        closeAllModal,
        availableModals
    }), [modals, openModal, closeModal, closeAllModal, availableModals]);

    return (
        <ModalContext.Provider value={values}>
            {children}
            <ModalContainer />
        </ModalContext.Provider>
    )
}

export const useContextModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        return {
            modals: [],
            openModal: () => console.warn('Modal context not available'),
            closeModal: () => console.warn('Modal context not available'),
            closeAllModal: () => console.warn('Modal context not available'),
            availableModals: []
        };
    }
    return context;
};