import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice.jsx";

const store = configureStore({
    reducer: {
        app: appReducer,
        auth: authReducer,
        ui: uiReducer,
    },
});

export default store;