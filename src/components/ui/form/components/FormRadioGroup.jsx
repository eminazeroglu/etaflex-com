import { Radio, Switch } from 'antd'
import React from 'react'

const FormRadioGroup = (
    {
       groups=[],
       value,
       fieldNames={label: 'name', value: 'id'},
       onChange
    }
) => {

    const handleChange = (e) => {
        onChange?.(e.target.value, e)
    }

    return (
        <Radio.Group className="form-radio-group" value={value} onChange={e => handleChange(e)}>
            {groups.map((group, index) => (
                <Radio.Button key={index} value={group[fieldNames.value]}>{group[fieldNames.label]}</Radio.Button>
            ))}
        </Radio.Group>
    )
}

export default FormRadioGroup  