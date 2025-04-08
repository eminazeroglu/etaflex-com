import React, {Suspense} from 'react';
import RouteProvider from "@/providers/RouteProvider.jsx";
import AuthMiddleware from "@/middleware/authMiddleware.jsx";
import { toPascalCase } from "@/utils/stringUtil.jsx";
import RouteBuilder from './routeBuilder.jsx';
import {RouterErrorElement} from "@/components/error/RouterErrorElement.jsx";
import {Loading} from "@/components/ui/index.jsx";

// Dynamically load all route files
const middlewares = import.meta.glob('/src/middleware/*', { eager: false });
const layouts = import.meta.glob('/src/layouts/main/*', { eager: false });

class Route {
    static routes = {
        admin: [],
        user: [],
        public: [],
        auth: [],
        common: []
    };

    static currentGroup = null;

    static group(type, callback) {
        if (!Object.keys(this.routes).includes(type)) {
            throw new Error(`Invalid route type. Must be one of: ${Object.keys(this.routes).join(', ')}`);
        }
        const previousGroup = this.currentGroup;
        this.currentGroup = type;
        callback();
        this.currentGroup = previousGroup;
    }

    static path(path, type = null) {
        const routeType = type || this.currentGroup || 'public';
        if (!Object.keys(this.routes).includes(routeType)) {
            throw new Error(`Invalid route type. Must be one of: ${Object.keys(this.routes).join(', ')}`);
        }

        const external = path.startsWith('http')

        const prefixedPath = (this.currentGroup && !external) ? `/${this.currentGroup}${path}` : path;
        const newRoute = new RouteBuilder(prefixedPath, routeType);
        this.routes[routeType].push(newRoute.route);
        return newRoute;
    }

    static getRoutes(type) {
        if (type) {
            return this.routes[type];
        }
        return this.routes;
    }

    static getAllRoutes() {
        return Object.values(this.routes).flat();
    }

    static getPublicPaths() {
        return [...this.routes.public, ...this.routes.auth].map(route => route.path);
    }

    static getRoutesByRole(role) {
        const roleRoutes = [];
        const allRoutes = this.getAllRoutes();

        allRoutes.forEach(route => {
            if (!route.roles || route.roles.length === 0) {
                roleRoutes.push(route);
            } else if (Array.isArray(route.roles) && (route.roles.includes(role) || route.roles.includes('common'))) {
                roleRoutes.push(route);
            } else if (['public', 'auth'].includes(route.layout)) {
                roleRoutes.push(route);
            }
        });

        // roleRoutes.push({
        //     path: '*',
        //     element: <AuthMiddleware />
        // });

        return roleRoutes;
    }

    static async getRoutesWithMiddlewaresAndLayouts(role) {
        const routes = this.getRoutesByRole(role);

        const processedRoutes = await Promise.all(
            routes.map(async ({ path, name, element, layout, middleware, ...props }) => {
                // Element-i Suspense ilə əhatə edirik
                let wrappedElement = (
                    <Suspense fallback={<Loading fullScreen loading={true} />}>
                        <RouteProvider>
                            {element}
                        </RouteProvider>
                    </Suspense>
                );

                // Layout tətbiq edirik
                if (layout) {
                    wrappedElement = await this.applyLayout(layout, wrappedElement);
                }

                // Middleware-ləri tətbiq edirik
                if (middleware) {
                    wrappedElement = await this.applyMiddlewares(middleware, wrappedElement, props);
                }

                return {
                    path,
                    name,
                    element: wrappedElement,
                    errorElement: <RouterErrorElement />, // Hər route üçün error elementi
                    ...props
                };
            })
        );

        // Catch-all route əlavə edirik
        // processedRoutes.push({
        //     path: '*',
        //     element: <RouterErrorElement />
        // });

        return processedRoutes;
    }

    static wrapWithErrorBoundary(element) {
        return (
            <Suspense fallback={<Loading fullScreen loading={true} />}>
                {element}
            </Suspense>
        );
    }

    static getMenuItems(role) {
        const allMenuItems = this.getRoutesByRole(role).filter(route => route.isMenu);

        const menuTree = [];
        const itemMap = {};

        allMenuItems.forEach(item => {
            itemMap[item.name] = { ...item, children: [] };
        });

        allMenuItems.forEach(item => {
            const [prefix, name] = item.name.split('.');
            if (item.parent) {
                const fullParentName = `${prefix}.${item.parent}`;
                if (itemMap[fullParentName]) {
                    itemMap[fullParentName].children.push(itemMap[item.name]);
                } else {
                    menuTree.push(itemMap[item.name]);
                }
            } else {
                menuTree.push(itemMap[item.name]);
            }
        });

        return menuTree;
    }

    static async applyLayout(layout, element) {
        const layoutPath = `/src/layouts/main/${toPascalCase(layout)}Layout.jsx`;
        if (layouts[layoutPath]) {
            const { default: Layout } = await layouts[layoutPath]();
            return <Layout>{element}</Layout>;
        }
        return element;
    }

    static async applyMiddleware(middleware, element, props = {}) {
        const middlewarePath = `/src/middleware/${middleware}Middleware.jsx`;
        if (middlewares[middlewarePath]) {
            const { default: Middleware } = await middlewares[middlewarePath]();
            return <Middleware {...props}>{element}</Middleware>;
        }
        return element;
    }

    static async applyMiddlewares(middlewareList, element, props = {}) {
        if (!middlewareList || middlewareList.length === 0) {
            return element;
        }
        const middlewareArray = Array.isArray(middlewareList) ? middlewareList : [middlewareList];

        let result = element;
        for (const middleware of middlewareArray) {
            result = await this.applyMiddleware(middleware, result, { ...props, middleware: middlewareArray });
        }
        return result;
    }
}

export const route = (name, params = {}) => {
    const allRoutes = Route.getAllRoutes();

    // Find the route
    let foundRoute;
    if (!name.includes('.')) {
        foundRoute = allRoutes.find(route => route.name === name);
        if (!foundRoute) {
            throw new Error(`Route [${name}] not found.`);
        }
    } else {
        const [type, routeName] = name.split('.');
        if (!Object.keys(Route.routes).includes(type)) {
            throw new Error(`Invalid route type [${type}]. Must be one of: ${Object.keys(Route.routes).join(', ')}`);
        }

        const typeRoutes = Route.routes[type];
        foundRoute = typeRoutes.find(route => route.name === name);

        if (!foundRoute) {
            throw new Error(`Route [${name}] not found in [${type}] routes.`);
        }
    }

    let path = foundRoute.path;
    const queryParams = {};

    // Handle the parameters
    if (params && typeof params === 'object') {
        const routeParams = [];
        // Find all dynamic parameters in the route
        const dynamicSegments = path.match(/:[a-zA-Z]+/g) || [];

        dynamicSegments.forEach(segment => {
            const paramName = segment.substring(1); // Remove the : prefix
            routeParams.push(paramName);

            if (params.hasOwnProperty(paramName)) {
                // Replace the dynamic parameter in the path
                path = path.replace(segment, encodeURIComponent(params[paramName]));
                // Remove the used parameter from params object
                delete params[paramName];
            }
        });

        // Add remaining params as query parameters
        Object.assign(queryParams, params);
    }

    // Add query parameters if any exist
    if (Object.keys(queryParams).length > 0) {
        const queryString = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        path = `${path}?${queryString}`;
    }

    return path;
};

export default Route