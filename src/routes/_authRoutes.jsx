import Route from "@/routes/utils/route.jsx";
import LoginPage from "@/pages/auth/login/index.jsx";

Route.group('auth', () => {
    /*
    * Login
    * */
    Route
        .path('/login')
        .name('login')
        .element(<LoginPage/>)
        .layout('auth')
        .middleware('guest')
});