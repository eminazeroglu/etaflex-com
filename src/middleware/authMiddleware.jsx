import {matchPath, Navigate, useLocation} from 'react-router';
import {getPublicPaths, getRoutesByRole} from '@/routes';
import {useAuthStore} from "@/hooks/store/useStore.jsx";
import {AUTH_CONFIG} from "@/config/authConfig.jsx";

const AuthMiddleware = ({ children }) => {
    const {token, role} = useAuthStore();
    const {pathname} = useLocation();
    const publicPaths = getPublicPaths();

    const isPublicPath = (currentPath) => {
        return publicPaths.some(path =>
            matchPath({ path, end: true }, currentPath)
        );
    };

    const isAllowedRoute = (currentPath) => {
        const allowedRoutes = getRoutesByRole(role);

        // Birbaşa tam uyğunluq yoxlaması
        const exactMatch = allowedRoutes.some(route => route.path === currentPath);
        if (exactMatch) {
            return true;
        }

        const currentSegments = currentPath.split('/').filter(Boolean);

        return allowedRoutes.some(route => {
            if (!route.path.includes(':')) return false;

            const routeSegments = route.path.split('/').filter(Boolean);

            if (routeSegments.length !== currentSegments.length) {
                return false;
            }

            return routeSegments.every((routeSegment, index) => {
                if (routeSegment.startsWith(':')) {
                    const param = currentSegments[index];
                    return true;
                }
                return routeSegment === currentSegments[index];
            });
        });
    };

    if (!token) {
        if (!pathname.startsWith('/auth') && (AUTH_CONFIG.forceLoginRedirect || !publicPaths.includes(pathname))) {
            // Qeydiyyatsız istifadəçi üçün yönləndirmə
            return <Navigate to={AUTH_CONFIG.loginRedirectPath} replace={true} />;
        }
    } else {
        // İstifadəçi autentifikasiya olunubsa, amma login səhifəsindədirsə
        if (pathname.startsWith('/auth')) {
            const redirectPath = AUTH_CONFIG.roleBasedRedirects[role] || AUTH_CONFIG.defaultRedirectPath;
            return <Navigate to={redirectPath} replace />;
        }

        // İstifadəçinin cari rola uyğun səhifəyə giriş icazəsi yoxdursa
        if ((!isAllowedRoute(pathname) && !isPublicPath(pathname)) || pathname === '/') {
            const redirectPath = AUTH_CONFIG.roleBasedRedirects[role] || AUTH_CONFIG.defaultRedirectPath;
            return <Navigate to={redirectPath} replace />;
        }
    }

    return children;
};

export default AuthMiddleware