import React, { useMemo } from 'react';
import { TreeSelect } from "antd";
import { translate } from "@/utils/localeUtil.jsx";

const FormTreeSelect = (
    {
        allowClear = false,
        showSearch = false,
        value,
        filteredId,
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
        fieldNames = { label: 'name', value: 'id', children: 'children' },
        filterKey = 'name',
        ...props
    }
) => {
    const filterTreeNode = (!ajaxSearch && !onSearch)
        ? (inputValue, node) => node[filterKey]?.toLowerCase().includes(inputValue.toLowerCase())
        : false;

    // Recursive function to filter out the edited item and its children
    const filterOutEditedItem = (items, editedValue) => {
        return items.reduce((acc, item) => {
            // Skip if this is the edited item
            if (item[fieldNames.value] === editedValue) {
                return acc;
            }

            // Process children recursively
            const filteredItem = { ...item };
            if (item[fieldNames.children]?.length) {
                filteredItem[fieldNames.children] = filterOutEditedItem(
                    item[fieldNames.children],
                    editedValue
                );
            }

            return [...acc, filteredItem];
        }, []);
    };

    const treeItems = useMemo(() => {
        // Filter out the edited item from options
        const filteredOptions = filteredId ? filterOutEditedItem(options, filteredId) : options;

        if (placeholder && props?.multiple !== true) {
            return [
                {
                    [fieldNames.value]: '',
                    [fieldNames.label]: placeholder,
                    disabled: true
                },
                ...filteredOptions.map(item => ({
                    [fieldNames.value]: item[fieldNames.value],
                    [fieldNames.label]: item[fieldNames.label],
                    [fieldNames.children]: item[fieldNames.children]?.map(child => ({
                        [fieldNames.value]: child[fieldNames.value],
                        [fieldNames.label]: child[fieldNames.label],
                        [fieldNames.children]: child[fieldNames.children]
                    }))
                }))
            ];
        }
        return filteredOptions;
    }, [options, placeholder, fieldNames, props?.multiple, filteredId]);

    const selectedValue = useMemo(() => {
        const findSelected = (items) => {
            for (const item of items) {
                if (typeof item.selected === 'boolean' && item.selected) {
                    return item[fieldNames.value];
                }
                if (selected && item[fieldNames.value] === selected) {
                    return item[fieldNames.value];
                }
                if (item[fieldNames.children]?.length) {
                    const childSelected = findSelected(item[fieldNames.children]);
                    if (childSelected) return childSelected;
                }
            }
            return '';
        };

        return findSelected(options);
    }, [options, selected, fieldNames]);

    return (
        <TreeSelect
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
            filterTreeNode={filterTreeNode}
            treeData={treeItems}
            placeholder={placeholder || undefined}
            {...props}
        />
    );
};

export default FormTreeSelect;