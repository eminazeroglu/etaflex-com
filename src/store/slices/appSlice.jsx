import {createSlice} from "@reduxjs/toolkit";
import {setStorage} from "@/utils/localStorageUtil.jsx";
import { APP_CONFIG } from "@/config/appConfig";

const initialState = {
    theme: APP_CONFIG.theme,
    fullScreen: false,
    language: APP_CONFIG.defaultLanguage,
    languages: [],
    errors: {},
    imageFormat: [],
    fileFormat: [],
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
            setStorage("language", action.payload);
        },
        setLanguages: (state, action) => {
            state.languages = action.payload;
            setStorage("languages", action.payload);
        },
        toggleTheme: (state) => {
            state.theme = state.theme === "light" ? "dark" : "light";
            setStorage("theme", state.theme);
        },
        toggleFullScreen: (state) => {
            state.fullScreen = !state.fullScreen;
            setStorage("fullScreen", state.fullScreen);
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            setStorage("theme", state.theme);
        },
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
    },
});

export const {
    setLanguage,
    setLanguages,
    toggleTheme,
    setTheme,
    setErrors,
    toggleFullScreen
} = appSlice.actions;

export default appSlice.reducer;