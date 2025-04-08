import React from 'react';
import PageContainer from "@/components/ui/page/index.jsx";
import Stepper from "@/components/ui/stepper/index.jsx";
import {Icon} from "@/components/ui/index.jsx";
import ShipmentDetail from "@/pages/user/schedule-delivery/components/shipment-detail/index.jsx";
import Address from "@/pages/user/schedule-delivery/components/address/index.jsx";
import PickUpTime from "@/pages/user/schedule-delivery/components/pick-up-time/index.jsx";
import OrderDetail from "@/pages/user/schedule-delivery/components/order-detail/index.jsx";
import Payment from "@/pages/user/schedule-delivery/components/payment/index.jsx";

function Page(props) {

    const items = [
        {
            label: 'Choose addresses',
            icon: <Icon name="location" size={24}/>,
            checked: true,
            component: Address
        },
        {
            label: 'Choose addresses',
            icon: <Icon name="truck" size={24}/>,
            component: ShipmentDetail
        },
        {
            label: 'Pick up time & services',
            icon: <Icon name="clock" size={24}/>,
            component: PickUpTime
        },
        {
            label: 'Order details',
            icon: <Icon name="document" size={24}/>,
            component: OrderDetail
        },
        {
            label: 'Complete payment',
            icon: <Icon name="payment" size={24}/>,
            component: Payment
        }
    ]

    return (
        <PageContainer>
            <Stepper
                items={items}
                selectedIndex={1}
            />
        </PageContainer>
    );
}

export default Page;