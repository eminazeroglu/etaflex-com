import Route from "@/routes/utils/route.jsx";
import DashboardProvider from "@/pages/admin/dashboard/index.jsx";

Route.group('admin', () => {
    // Dashboard
    Route
        .path('')
        .name('dashboard')
        .label('navbar.dashboard')
        .element(<DashboardProvider/>)
        .menu()
        .layout('App')
        .middleware(['auth'])
})