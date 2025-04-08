import React from 'react';
import {FormCheckbox, FormGroup} from "@/components/ui/form/index.jsx";
import {FaWhatsapp} from "react-icons/fa6";
import {FiMinus, FiPlus} from "react-icons/fi";
import {FormPhone} from "@/components/ui/form/components/index.jsx";

function FormPhoneGroup({value, label, onChange}) {
    const handlePhone = (index, key, val) => {
        const items = [...value]
        items[index][key] = val;
        onChange(items);
    }

    const handleActionPhone = (action, index) => {
        const items = [...value];
        if (action === 'add') {
            items.push({number: '', is_whatsapp: false})
        } else if (action === 'remove') {
            items.splice(index, 1)
        }
        onChange(items);
    }
    return (
        <div className="space-y-2">
            {value?.map((item, index) => (
                <FormGroup
                    key={index}
                    label={index === 0 && label}
                    suffix={
                        <FormCheckbox
                            label={
                                <span
                                    className="flex items-center gap-1"
                                >
                                    <FaWhatsapp/>
                                    <span>Whatsapp</span>
                                </span>
                            }
                            className="ml-2"
                            onChange={val => handlePhone(index, 'is_whatsapp', val)}
                            checked={item.is_whatsapp}
                        />
                    }
                    suffixClass="border-r pr-2"
                    prefix={
                        <div>
                            <button
                                className={`btn btn--${index === 0 ? 'indigo' : 'danger'} btn--sm`}
                                onClick={() => handleActionPhone(index === 0 ? 'add' : 'remove', index)}
                            >
                                {index === 0 ? <FiPlus/> : <FiMinus/>}
                            </button>
                        </div>
                    }
                >
                    <FormPhone
                        onChange={val => handlePhone(index, 'number', val)}
                        value={item.number}
                    />
                </FormGroup>
            ))}
        </div>
    )
}

export default FormPhoneGroup;