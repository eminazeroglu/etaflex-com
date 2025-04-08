import store from "@/store/index.jsx";
import {
    setErrors,
    setLanguage,
    setLanguages,
    setTheme,
    toggleFullScreen,
    toggleTheme
} from "@/store/slices/appSlice.jsx";

const dispatch = store.dispatch;
export const appActions = {
    toggleTheme: (notification = true) => {
        const theme = store.getState().app.theme;
        dispatch(toggleTheme());
        return theme;
    },
    toggleFullScreen: () => {
        dispatch(toggleFullScreen());
    },
    setTheme: (val) => dispatch(setTheme(val)),
    setErrors: (val) => dispatch(setErrors(val)),
    changeLanguage: (lang) => dispatch(setLanguage(lang)),
    languages: (val) => dispatch(setLanguages(val)),
}