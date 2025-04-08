import React from 'react';
import {Input} from "antd";

const FormPassword = ({
                          allowClear,
                          value,
                          name,
                          type,
                          bordered = false,
                          defaultValue,
                          maxLength,
                          showCount,
                          onChange,
                          ...props
                      }) => {
    const handleChange = (e) => {
        onChange(e.target.value.trim());
    };

    return (
        <Input.Password
            name={name}
            type={type}
            allowClear={allowClear}
            variant={bordered ? 'outlined' : 'filled'}
            showCount={showCount}
            defaultValue={defaultValue}
            maxLength={maxLength}
            rootClassName="form-item"
            onChange={handleChange}
            value={value}
            {...props}
        />
    );
};

export default FormPassword;