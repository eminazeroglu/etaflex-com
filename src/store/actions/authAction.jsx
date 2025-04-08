import store from "@/store/index.jsx";
import {logout, setToken, setUser} from "@/store/slices/authSlice.jsx";

const dispatch = store.dispatch;

export const authActions = {
    token: (val) => dispatch(setToken(val)),
    user: (val) => dispatch(setUser(val)),
    logout: () => {
        dispatch(logout())
        window.location.reload()
    }
}