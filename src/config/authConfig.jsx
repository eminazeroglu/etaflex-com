export const AUTH_CONFIG = {
    loginRedirectPath: '/auth/login',
    defaultRedirectPath: '/',
    unauthorizedRedirect: '/auth/login',
    roleBasedRedirects: {
        admin: '/admin',
        user: '/user',
    },
    forceLoginRedirect: true,
    logoutStorageKeys: [
        'token',
        'user',
        'role',
        'permissions',
    ]
};