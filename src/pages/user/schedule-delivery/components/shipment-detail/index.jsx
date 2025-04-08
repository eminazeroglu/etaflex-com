import React, {useEffect} from 'react';
import {Button, Card, Icon, Image} from "@/components/ui/index.jsx";
import {FormGroup} from "@/components/ui/form/components/index.jsx";
import {FormSelect, FormText} from "@/components/ui/form/index.jsx";
import {Col, Row, Switch} from "antd";
import {getAssetsImages} from "@/utils/helpersUtil.jsx";
import {FiChevronDown, FiChevronUp, FiPlus, FiSave} from "react-icons/fi";
import useForm from "@/hooks/form/useForm.jsx";
import TooltipInfo from "@/components/ui/tooltip-info/index.jsx";

const MinCollapse = ({title, children, isOpen}) => {

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen]);

    return (
        <div>
            <div className="flex items-center text-base gap-x-[4px] cursor-pointer" onClick={() => setOpen(!open)}>
                <span className="text-primary">
                    {!open ? <FiChevronDown/> : <FiChevronUp/>}
                </span>
                <span>{title}</span>
            </div>

            {open && (
                <div className="mt-2">
                    {children}
                </div>
            )}
        </div>
    )
}

function ShipmentDetail(props) {

    const {values, setField} = useForm({
        initialValues: {
            category: '',
            size: '',
            item: '',
        }
    })

    const vehicleTypes = [
        {
            image: getAssetsImages('car.svg'),
            name: 'Car',
            tooltip: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
            image: getAssetsImages('suv.svg'),
            name: 'SUV',
            tooltip: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
            image: getAssetsImages('mini-van.svg'),
            name: 'Mini VAN',
            tooltip: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
            image: getAssetsImages('pickup-truck.svg'),
            name: 'Pickup Truck',
            tooltip: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
            image: getAssetsImages('cargo-van.svg'),
            name: '9ft Cargo VAN',
            tooltip: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
            image: getAssetsImages('refrigerated-cargo-van.svg'),
            name: '9ft Refrigerated Cargo VAN',
            tooltip: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
            image: getAssetsImages('box-truck-10.svg'),
            name: '10ft Box Truck',
            tooltip: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
            image: getAssetsImages('box-truck-15.svg'),
            name: '15ft Box Truck',
            tooltip: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
            image: getAssetsImages('box-truck-17.svg'),
            name: '17ft Box Truck',
            tooltip: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
            image: getAssetsImages('box-truck-26.svg'),
            name: '26ft Box Truck',
            tooltip: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        }
    ]

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-[20px] font-bold">Shipment details</h4>
                <div>
                    <Button roundedFull={true} property={'gray-outline'} className="!px-10">
                        Shipment templates
                    </Button>
                </div>
            </div>

            <div>
                <div className="mb-[20px]">
                    <FormGroup
                        label="Category"
                        required={true}
                    >
                        <FormSelect
                            value={values.category}
                            onChange={(e) => setField('category', e)}
                            options={[
                                {id: '1', name: 'Baggage'},
                                {id: '2', name: 'Baggage 2'},
                                {id: '3', name: 'Baggage 3'},
                                {id: '4', name: 'Baggage 4'},
                                {id: '5', name: 'Baggage 5'},
                            ]}
                        />
                    </FormGroup>
                </div>

                <Card
                    title={'General item'}
                    collapse={true}
                    open={true}
                >
                    <Row gutter={[20, 20]}>
                        <Col xs={24} lg={12}>
                            <FormGroup
                                label="Size and Weight"
                                required={true}
                            >
                                <FormSelect
                                    value={values.size}
                                    onChange={(e) => setField('size', e)}
                                    options={[
                                        {id: '1', name: 'Extra Large (71+ Lbs)'},
                                        {id: '2', name: 'Extra Large (72+ Lbs)'},
                                        {id: '3', name: 'Extra Large (73+ Lbs)'},
                                    ]}
                                />
                            </FormGroup>
                            <p className="text-muted mt-[4px]">Major appliance, carpets, mattresses, equipment,
                                furniture and
                                other items between 70 - 150 Lbs</p>
                        </Col>

                        <Col xs={24} lg={12}>
                            <FormGroup
                                label="Item(s) value"
                                required={true}
                                tooltip="Enter the appropriate item value for insurance purposes"
                                suffix={
                                    <span className="text-primary-dark">
                                         <Icon name="dollar"/>
                                    </span>
                                }
                            >
                                <FormText
                                    value={values.item}
                                    onChange={(e) => setField('item', e)}
                                    placeholder="Enter the appropriate item value for insurance purposes"
                                />
                            </FormGroup>
                        </Col>

                        <Col xs={24} lg={12}>
                            <div className="space-y-4">
                                <MinCollapse
                                    isOpen={true}
                                    title={
                                        <span className="text-primary space-x-1">
                                            <span>Choose custom dimensions</span>
                                            <span className="text-muted">(optional)</span>
                                        </span>
                                    }
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-x-4">
                                            <Switch/>
                                            <div>
                                                <p className="font-medium">Fragile Item</p>
                                                <p className="text-muted">Package requires special handling</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-x-4">
                                            <Switch/>
                                            <div>
                                                <p className="font-medium">Age Verification Required</p>
                                                <p className="text-muted">For alcohol, tobacco, or restricted items categories</p>
                                            </div>
                                        </div>
                                    </div>
                                </MinCollapse>

                                <MinCollapse
                                    title={
                                        <span className="text-primary space-x-1">
                                            <span>Add General Item details</span>
                                            <span className="text-muted">(optional)</span>
                                        </span>
                                    }
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-x-4">
                                            <Switch/>
                                            <div>
                                                <p className="font-medium">Fragile Item</p>
                                                <p className="text-muted">Package requires special handling</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-x-4">
                                            <Switch/>
                                            <div>
                                                <p className="font-medium">Age Verification Required</p>
                                                <p className="text-muted">For alcohol, tobacco, or restricted items categories</p>
                                            </div>
                                        </div>
                                    </div>
                                </MinCollapse>
                            </div>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Image
                                src={getAssetsImages('schedule-delivery')}
                            />
                        </Col>
                    </Row>

                </Card>

                <div className="mt-4">
                    <Button icon={<FiPlus/>} property="primary-outline" roundedFull={true} size="lg">
                        <span className="font-semibold">Add one more item</span>
                    </Button>
                </div>

                <div className="flex items-center justify-between mb-4 mt-4">
                    <h4 className="text-[20px] font-bold space-x-2 flex items-center">
                        <span>Select Vehicle Type</span>
                        <TooltipInfo iconClass="text-xl" title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aut autem culpa deserunt eius eos error hic magni maxime nemo non odit quae, quaerat, sint ullam ut vero voluptatem voluptatum."/>
                    </h4>
                </div>

                <div className="grid grid-cols-5 gap-5">
                    {vehicleTypes.map((item, index) => (
                        <div key={index} className="bg-[#F6F4FF] flex items-center gap-4 p-3 rounded-[10px] border-[#D1CDEA] border">
                            <div className="size-11 p-[10px] shrink-0 bg-white flex items-center justify-center rounded-[7px]">
                                <Image
                                    className=""
                                    src={item.image}
                                />
                            </div>
                            <div className="flex items-start font-semibold gap-x-2 text-[14px]">
                                <span>{item.name}</span>
                                <span>
                                    <TooltipInfo title={item.tooltip} />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <hr className="my-4"/>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-4">
                        <Button size={'lg'} roundedFull={true} property="gray-outline">
                            Back
                        </Button>

                        <Button icon={<FiSave/>} size={'lg'} roundedFull={true} property="gray-outline">
                            Save Items Template
                        </Button>
                    </div>

                    <div>
                        <Button size={'lg'} roundedFull={true}>
                            <span className="font-semibold">Continue</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShipmentDetail;