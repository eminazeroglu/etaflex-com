import React from 'react';
import {Input} from "antd";

const FormTextarea = ({
                          allowClear,
                          value,
                          name,
                          bordered = false,
                          defaultValue,
                          maxLength,
                          showCount,
                          onChange,
                          rows,
                          ...props
                      }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <Input.TextArea
            name={name}
            rows={rows}
            rootClassName="form-item"
            allowClear={allowClear}
            variant={bordered ? 'outlined' : 'filled'}
            showCount={showCount}
            defaultValue={defaultValue}
            maxLength={maxLength}
            onChange={handleChange}
            value={value}
            {...props}
        />
    );
};

export default FormTextarea;