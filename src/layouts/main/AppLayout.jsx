import React from 'react';
import Header from "@/layouts/header/index.jsx";

function AppLayout({children}) {
    return (
        <div className="app-layout">
            <Header/>
            {children}
        </div>
    );
}

export default AppLayout;