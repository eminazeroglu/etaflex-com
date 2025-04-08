import {getStorage} from "@/utils/localStorageUtil.jsx";

export default class RouteBuilder {
    constructor(path, type) {
        this.route = {
            path,
            type,
            element: null,
            layout: null,
            icon: null,
            middleware: [],
            isMenu: false,
            external: false,
            name: '',
            label: '',
            parent: null,
            permission: null,
            parentPermissions: [],
            roles: []
        };
    }

    element(component) {
        this.route.element = component
        return this;
    }

    icon(icon) {
        this.route.icon = icon;
        return this;
    }

    layout(layout) {
        this.route.layout = layout;
        return this;
    }

    parentPermissions(permissions) {
        this.route.parentPermissions = permissions;
        return this;
    }

    middleware(middleware) {
        if (Array.isArray(middleware)) {
            this.route.middleware.push(...middleware);
        } else {
            this.route.middleware.push(middleware);
        }
        return this;
    }

    menu(isMenu = true) {
        const permissions = getStorage('permissions');
        const permission = this.route.permission;
        this.route.isMenu = isMenu;
        if (!permissions?.includes(permission) && permission) {
            this.route.isMenu = false;
        }
        return this;
    }

    external(external = true) {
        this.route.external = external;
        return this;
    }

    name(name) {
        this.route.name = this.route.type !== 'public' ? `${this.route.type}.${name}` : name;
        return this;
    }

    label(label) {
        this.route.label = label;
        return this;
    }

    permission(permission) {
        this.route.permission = permission;
        return this;
    }

    parent(parent) {
        this.route.parent = parent;
        return this;
    }

    roles(roles) {
        if (Array.isArray(roles)) {
            this.route.roles = roles;
        } else {
            this.route.roles = [roles];
        }
        return this;
    }
}