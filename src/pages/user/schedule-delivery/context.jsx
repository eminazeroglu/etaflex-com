import {createContext, useContext, useState} from "react";

const Context = createContext();

const BaseContext = ({ children }) => {
    const translateKey = 'pages.scheduleDelivery';

    const [state, setState] = useState({
        translateKey,
    })

    const updateState = (newState) => {
        setState(prevState => ({
            ...prevState,
            ...newState
        }))
    }

    const values = {
        ...state,
        updateState
    }

    return (
        <Context.Provider value={values}>
            {children}
        </Context.Provider>
    )
}

export const ContextProvider = BaseContext;

export const useUserScheduleDeliveryContext = () => useContext(Context)