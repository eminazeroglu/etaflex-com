import store from "@/store/index.jsx";

export const can = (permission) => {
    const permissions = store.getState().auth.permissions;
    return !!permissions.includes(permission);
}

export const canAll = (all = []) => {
    const permissions = store.getState().auth.permissions;
    if (!permissions.length) return false;
    return permissions.some((i) => all.includes(i));
}