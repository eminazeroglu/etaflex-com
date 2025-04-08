import store from "@/store/index.jsx";
import {
    setLoading,
} from "@/store/slices/uiSlice.jsx";

const dispatch = store.dispatch;
export const uiActions = {
    loading: val => dispatch(setLoading(val)),
}