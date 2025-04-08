import Route from "@/routes/utils/route.jsx";
import ScheduleDeliveryProvider from "@/pages/user/schedule-delivery/index.jsx";

Route.group('user', () => {
    // Dashboard
    Route
        .path('/schedule-delivery')
        .name('scheduleDelivery')
        .label('navbar.scheduleDelivery')
        .element(<ScheduleDeliveryProvider/>)
        .menu()
        .layout('App')
        //.middleware(['auth'])
})