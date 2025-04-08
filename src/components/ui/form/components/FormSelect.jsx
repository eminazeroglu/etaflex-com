import React, {useMemo} from 'react';
import {Select} from "antd";
import {translate} from "@/utils/localeUtil.jsx";

const FormSelect = (
    {
        allowClear = false,
        showSearch = true,
        value,
        type,
        placeholder = translate('enum.select'),
        bordered = false,
        ajaxSearch = false,
        defaultValue,
        selected = false,
        onChange,
        onSearch,
        onClear,
        options = [],
        fieldNames = {label: 'name', value: 'id'},
        filterKey = 'name',
        ...props
    }
) => {
    // HTML təmizləmə funksiyası axtarış üçün
    const stripHtml = (str) => str?.replace(/<[^>]*>/g, '') || '';

    // Axtarış funksiyası - HTML varsa təmizləyib axtarır
    const filterOption = (!ajaxSearch && !onSearch)
        ? (input, option) => stripHtml(option[filterKey]).toLowerCase().includes(input.toLowerCase())
        : false;

    const optItems = useMemo(() => {
        if (placeholder && props?.mode !== 'multiple') {
            return [
                {[fieldNames.value]: '', [fieldNames.label]: placeholder},
                ...options.map(i => ({
                    [fieldNames.value]: i[[fieldNames.value]],
                    [fieldNames.label]: i[[fieldNames.label]],
                }))
            ]
        }
        return options;
    }, [options, placeholder])

    const selectedValue = useMemo(() => {
        const findSelected = options.find(i => {
            if (typeof i.selected === 'boolean')
                return i.selected;
            else if (selected) {
                return i[fieldNames.value] === selected;
            }
        })
        if (findSelected)
            return findSelected[fieldNames.value];
        return '';
    }, [options, selected])

    return (
        <Select
            type={type}
            allowClear={allowClear}
            showSearch={showSearch}
            variant={bordered ? 'outlined' : 'filled'}
            defaultValue={defaultValue}
            onChange={onChange}
            value={value || selectedValue}
            onSearch={onSearch}
            onClear={onClear}
            fieldNames={fieldNames}
            rootClassName="form-item"
            filterOption={filterOption}
            options={optItems}
            placeholder={placeholder || undefined}
            optionRender={(option) => (
                <div dangerouslySetInnerHTML={{__html: option.data[fieldNames.label]}}/>
            )}
            labelInValue={false}
            labelRender={(item) => (
                <div dangerouslySetInnerHTML={{__html: item.label}}/>
            )}
            {...props}
        />
    );
};

export default FormSelect;