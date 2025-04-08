import React from 'react';
import {InputNumber} from "antd";

const FormNumber = ({
                        step,
                        value,
                        name,
                        bordered = false,
                        defaultValue,
                        min,
                        max,
                        onChange,
                        ...props
                    }) => {
    return (
        <InputNumber
            name={name}
            variant={bordered ? 'outlined' : 'filled'}
            step={step}
            defaultValue={defaultValue}
            min={min}
            max={max}
            rootClassName="form-item"
            onChange={onChange}
            value={value}
            {...props}
        />
    );
};

export default FormNumber;