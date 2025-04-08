import React, {useMemo} from 'react';
import {DatePicker, ConfigProvider} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/az";
import locale from "antd/locale/az_AZ";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {getCurrentLanguage, translate} from "@/utils/localeUtil.jsx";

// Lazımi pluginləri əlavə edirik
dayjs.extend(utc);
dayjs.extend(timezone);

// Azərbaycan dilini aktivləşdiririk
dayjs.locale(getCurrentLanguage());

// Azərbaycan üçün xüsusi tərcümələr
const months = [
    translate('enum.month.1'),
    translate('enum.month.2'),
    translate('enum.month.3'),
    translate('enum.month.4'),
    translate('enum.month.5'),
    translate('enum.month.6'),
    translate('enum.month.7'),
    translate('enum.month.8'),
    translate('enum.month.9'),
    translate('enum.month.10'),
    translate('enum.month.11'),
    translate('enum.month.12')
];

const weekDays = [
    translate('enum.weekDays.7.long'),
    translate('enum.weekDays.1.long'),
    translate('enum.weekDays.2.long'),
    translate('enum.weekDays.3.long'),
    translate('enum.weekDays.4.long'),
    translate('enum.weekDays.5.long'),
    translate('enum.weekDays.6.long')
];

const weekDaysShort = [
    translate('enum.weekDays.7.short'),
    translate('enum.weekDays.1.short'),
    translate('enum.weekDays.2.short'),
    translate('enum.weekDays.3.short'),
    translate('enum.weekDays.4.short'),
    translate('enum.weekDays.5.short'),
    translate('enum.weekDays.6.short')
];

function FormDatePicker({
                            allowEmpty,
                            allowClear = true,
                            value,
                            valueFormat = 'YYYY-MM-DD',
                            bordered = false,
                            defaultValue,
                            maxLength,
                            showCount,
                            onChange,
                            format,
                            time = false,
                            mode,
                            maxDate,
                            minDate,
                            ...props
                        }) {
    const pickerType = mode === 'month' ? 'month' : 'date';

    const getDefaultFormat = () => {
        if (mode === 'month') return 'YYYY-MM';
        if (time) return 'YYYY-MM-DD HH:mm:ss';
        return valueFormat;
    };

    // Dəyəri Azərbaycan saat qurşağına çeviririk
    const convertedValue = useMemo(() => {
        if (!value) return null;
        return dayjs(value).tz('Asia/Baku');
    }, [value]);

    const convertedMaxDate = useMemo(() => {
        if (!maxDate) return null;
        return dayjs(maxDate).tz('Asia/Baku');
    }, [maxDate]);

    const convertedMinDate = useMemo(() => {
        if (!minDate) return null;
        return dayjs(minDate).tz('Asia/Baku');
    }, [minDate]);

    const disabledDate = (current) => {
        if (!current) return false;

        let isDisabled = false;

        if (convertedMaxDate) {
            isDisabled = isDisabled || current.isAfter(convertedMaxDate, 'day');
        }

        if (convertedMinDate) {
            isDisabled = isDisabled || current.isBefore(convertedMinDate, 'day');
        }

        return isDisabled;
    };

    const finalFormat = format || getDefaultFormat();

    // Xüsusi locale konfiqurasiyası
    const customLocale = {
        ...locale,
        DatePicker: {
            ...locale.DatePicker,
            lang: {
                ...locale.DatePicker.lang,
                monthFormat: 'MMMM',
                monthSelect: translate('enum.selectMonth'),
                yearSelect: translate('enum.selectYear'),
                decadeSelect: translate('enum.select10Year'),
                months: months,
                weekDays: weekDays,
                weekDaysShort: weekDaysShort,
            }
        }
    };

    return (
        <ConfigProvider locale={customLocale}>
            <DatePicker
                allowEmpty={allowEmpty}
                allowClear={allowClear}
                variant={bordered}
                showCount={showCount}
                defaultValue={defaultValue}
                maxLength={maxLength}
                onChange={(val) => {
                    // Seçilmiş tarixi Bakı vaxtına çeviririk
                    const bakedDate = val ? val.tz('Asia/Baku') : null;
                    onChange(bakedDate?.format(finalFormat) || '');
                }}
                value={convertedValue}
                format={finalFormat}
                showTime={time}
                picker={pickerType}
                disabledDate={disabledDate}
                rootClassName="form-item"
                {...props}
            />
        </ConfigProvider>
    );
}

export default FormDatePicker;