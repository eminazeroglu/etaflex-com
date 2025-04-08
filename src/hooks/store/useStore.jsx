import {useSelector} from "react-redux";

export const useAppStore = () => useSelector(state => state.app)

export const useAuthStore = () => useSelector(state => state.auth)

export const useUiStore = () => useSelector(state => state.ui)