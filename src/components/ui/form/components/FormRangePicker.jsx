import React, { useMemo, useState, useCallback } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { AiOutlineMinus } from "react-icons/ai";
import { translate } from "@/utils/localeUtil.jsx";

const { RangePicker } = DatePicker;

const RANGE_PRESETS = {
    TODAY: 'today',
    YESTERDAY: 'yesterday',
    LAST_7_DAYS: 'last-7-days',
    LAST_30_DAYS: 'last-30-days',
    LAST_90_DAYS: 'last-90-days',
    THIS_MONTH: 'this-month',
    LAST_MONTH: 'last-month',
    ALL: 'all',
};

function FormRangePicker(
    {
        allowEmpty,
        allowClear = true,
        value,
        bordered = false,
        defaultValue,
        selectKey,
        maxLength,
        showCount,
        onChange,
        format,
        valueFormat = 'YYYY-MM-DD',
        today = true,
        yesterday = true,
        last7days = true,
        last30days = true,
        thisMonth = true,
        lastMonth = true,
        last90Days = true,
        all = true,
        leftMenu = true,
        allStartDate,
        placement = 'bottomLeft',
        mode = 'date',
        ...props
    }
) {
    const [selected, setSelected] = useState(null);

    // Mode-a görə format təyin edirik
    const getDefaultFormat = () => {
        if (mode === 'month') return 'YYYY-MM';
        if (mode === 'year') return 'YYYY';
        return valueFormat;
    };

    const finalFormat = format || getDefaultFormat();

    // Format dates before returning
    const handleChange = useCallback((dates) => {
        if (!dates) {
            onChange(null);
            return;
        }

        const formattedDates = dates.map(date => date.format(finalFormat));
        onChange(formattedDates);
    }, [onChange, finalFormat]);

    // Convert string dates to dayjs objects if value is provided
    const convertedValue = useMemo(() => {
        if (!value || !Array.isArray(value) || !value[0] || !value[1]) return null;
        return value.map(date => typeof date === 'string' ? dayjs(date) : date);
    }, [value]);

    const generateDateRangeItems = useCallback(() => {
        const items = [];

        if (today) {
            items.push({
                key: RANGE_PRESETS.TODAY,
                order: 0,
                value: [dayjs(), dayjs()],
                text: translate('components.datepicker.today'),
            });
        }

        if (yesterday) {
            items.push({
                key: RANGE_PRESETS.YESTERDAY,
                order: 1,
                value: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')],
                text: translate('components.datepicker.yesterday'),
            });
        }

        if (last7days) {
            items.push({
                key: RANGE_PRESETS.LAST_7_DAYS,
                order: 2,
                value: [dayjs().subtract(6, 'day'), dayjs()],
                text: translate('components.datepicker.last7Days'),
            });
        }

        if (last30days) {
            items.push({
                key: RANGE_PRESETS.LAST_30_DAYS,
                order: 3,
                value: [dayjs().subtract(29, 'day'), dayjs()],
                text: translate('components.datepicker.last30Days'),
            });
        }

        if (last90Days) {
            items.push({
                key: RANGE_PRESETS.LAST_90_DAYS,
                order: 4,
                value: [dayjs().subtract(89, 'day'), dayjs()],
                text: translate('components.datepicker.last90Days'),
            });
        }

        if (thisMonth) {
            items.push({
                key: RANGE_PRESETS.THIS_MONTH,
                order: 5,
                value: [dayjs().startOf('month'), dayjs().endOf('month')],
                text: translate('components.datepicker.thisMonth'),
            });
        }

        if (lastMonth) {
            items.push({
                key: RANGE_PRESETS.LAST_MONTH,
                order: 50,
                value: [
                    dayjs().subtract(1, 'month').startOf('month'),
                    dayjs().subtract(1, 'month').endOf('month'),
                ],
                text: translate('components.datepicker.lastMonth'),
            });
        }

        if (all) {
            items.push({
                key: RANGE_PRESETS.ALL,
                order: 100,
                value: [
                    allStartDate ? dayjs(allStartDate) : dayjs().subtract(2, 'year').startOf('year'),
                    dayjs(),
                ],
                text: translate('components.datepicker.all'),
            });
        }

        for (let i = 1; i <= 3; i++) {
            const start = dayjs().subtract(i, 'month').startOf('month');
            const end = dayjs().subtract(i, 'month').endOf('month');
            items.push({
                order: 56,
                key: `last-__${i + 1}__-month`,
                value: [start, end],
                text: translate(`enum.month.${start.format('M')}`),
            });
        }

        return items;
    }, [today, yesterday, last7days, last30days, last90Days, thisMonth, lastMonth, all, allStartDate]);

    const dateRangeItems = useMemo(() => generateDateRangeItems(), [generateDateRangeItems]);

    const handleRangeClick = useCallback((item) => {
        setSelected(item.key);
        const formattedDates = item.value.map(date => date.format(finalFormat));
        onChange(formattedDates);
    }, [onChange, finalFormat]);

    const isActiveRange = useCallback((rangeValue) => {
        if (!convertedValue?.[0] || !convertedValue?.[1]) return false;
        return (
            convertedValue[0].format(finalFormat) === rangeValue[0].format(finalFormat) &&
            convertedValue[1].format(finalFormat) === rangeValue[1].format(finalFormat)
        );
    }, [convertedValue, finalFormat]);

    const renderPanel = useCallback((node) => {
        return (
            <div className="flex lg:flex-row lg:w-auto w-[calc(100vw_-_2.5rem)] flex-col">
                {leftMenu && (
                    <div className="lg:flex-1 p-2 lg:block flex overflow-x-auto">
                        <div className="lg:grid overflow-x-auto flex lg:grid-cols-1 gap-2">
                            {dateRangeItems
                                .sort((a, b) => a.order - b.order)
                                .map((item, index) => (
                                    <button
                                        key={index}
                                        className={`
                                        btn dark:text-white btn--sm w-full
                                        ${isActiveRange(item.value) ? 'dark:!text-secondary text-blue-500 bg-blue-50 dark-bg-main' : ''}
                                        hover:bg-gray-100 dark:hover:dark-bg-light-mute
                                        transition-colors duration-200
                                        text-sm py-1.5 px-3 rounded
                                    `}
                                        onClick={() => handleRangeClick(item)}
                                    >
                                        {item.text}
                                    </button>
                                ))}
                        </div>
                    </div>
                )}
                <div className="overflow-auto border-t lg:border-t-0 lg:border-l border-color">
                    {node}
                </div>
            </div>
        );
    }, [dateRangeItems, isActiveRange, handleRangeClick, leftMenu]);

    return (
        <RangePicker
            className="form-item"
            allowEmpty={allowEmpty}
            allowClear={allowClear}
            variant={bordered}
            showCount={showCount}
            defaultValue={defaultValue}
            maxLength={maxLength}
            onChange={handleChange}
            value={convertedValue}
            format={finalFormat}
            separator={<AiOutlineMinus />}
            placement={placement}
            popupClassName="!w-auto"
            panelRender={renderPanel}
            picker={mode}
            {...props}
        />
    );
}

export default FormRangePicker;