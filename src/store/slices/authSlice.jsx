import {createSlice} from "@reduxjs/toolkit";
import {getStorage, setStorage, removeStorage} from "@/utils/localStorageUtil.jsx";
import {AUTH_CONFIG} from "@/config/authConfig.jsx";

const initialState = {
    token: getStorage("token") || "",
    user: {},
    role: getStorage("role") ? getStorage("role") : "user",
    permissions: getStorage("permissions") ? getStorage("permissions") : "",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            action.payload
                ? setStorage("token", action.payload)
                : removeStorage("token");
        },
        setUser: (state, action) => {
            state.user = action.payload;
            setStorage('user', state.user)
            state.role = state.user?.role || "";
            state.permissions = state.user?.permissions || "";
            state.user?.role
                ? setStorage("role", state.user.role)
                : removeStorage("role");
            state.user?.permissions
                ? setStorage("permissions", state.user.permissions)
                : removeStorage("permissions");
        },
        logout: (state) => {
            AUTH_CONFIG.logoutStorageKeys.forEach(key => {
                state[key] = '';
                removeStorage(key);
            })
        },
    },
});

export const {
    setToken,
    setUser,
    logout,
} = authSlice.actions;

export default authSlice.reducer;