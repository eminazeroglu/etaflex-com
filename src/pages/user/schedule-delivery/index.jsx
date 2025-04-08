import React from 'react';
import {ContextProvider} from "./context.jsx";
import Page from "./page.jsx";

function ScheduleDeliveryProvider(props) {
    return (
        <ContextProvider>
            <Page/>
        </ContextProvider>
    );
}

export default ScheduleDeliveryProvider;