import './_authRoutes.jsx'
import './_userRoutes.jsx'
import './_publicRoutes.jsx'
import './_adminRoutes.jsx'
import Route from './utils/route.jsx';

export const getAllRoutes = () => Route.getAllRoutes()

export const getPublicPaths = () =>  Route.getPublicPaths();

export const getRoutesByRole = (role) => {
    return Route.getRoutesByRole(role);
}

export const getRoutes = (role) => {
    return Route.getRoutesWithMiddlewaresAndLayouts(role)
};

export const getMenuItems = (role) => {
    return Route.getMenuItems(role)
}
