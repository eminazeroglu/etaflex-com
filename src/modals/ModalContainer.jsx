import React from 'react';
import { useContextModal } from "@/contexts/ModalContext.jsx";

function ModalContainer() {
    const { modals = [], closeModal } = useContextModal();

    if (!Array.isArray(modals)) {
        return null;
    }

    return (
        <>
            {modals.map(({id, name, props, Component}) => {
                if (!Component) {
                    console.warn(`Modal component for name ${name} not found.`);
                    return null;
                }
                return (
                    <Component
                        key={id}
                        {...props}
                        onClose={() => closeModal(id)}
                    />
                );
            })}
        </>
    );
}

export default ModalContainer;