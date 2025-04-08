import React from 'react';
import {Modal as AntdModal} from 'antd';
import './index.css';
import classNames from "classnames";
import {Button} from "@/components/ui/index.jsx";
import {translate} from "@/utils/localeUtil.jsx";

const Modal = (
    {
        children,
        className,
        closable = true,
        bodyClass,
        size = 'md',
        bodyNotPadding = false,
        backdrop = true,
        title,
        visible,
        onClose,
        onSuccess,
        btnSaveDisabled = false,
        btnSaveText,
        btnCloseText,
        btnSaveLoading = false,
        btnCloseShow = true,
        btnSaveShow = true,
        footerPosition = 'right',
        footerShow = false,
        footerRender,
        ...props
    }
) => {
    const handleOk = () => {
        if (onSuccess) {
            onSuccess();
        }
    };

    const handleCancel = (e) => {
        const isCloseButton = e.target.closest('button');
        if (!backdrop || isCloseButton) {
            onClose();
        }
    };

    const footerButtons = () => {
        if (footerRender) return footerRender;
        else {
            return (
                <>
                    {btnCloseShow && (
                        <Button property="secondary" block={footerPosition === 'center'}
                                onClick={e => handleCancel(e, 'close')}>
                            <span>{btnCloseText || translate('button.close')}</span>
                        </Button>
                    )}
                    {btnSaveShow && (
                        <Button
                            onClick={() => onSuccess?.()}
                            disabled={btnSaveDisabled}
                            block={footerPosition === 'center'}
                            loading={btnSaveLoading}
                        >
                            {translate(btnSaveText || 'button.save')}
                        </Button>
                    )}
                </>
            )
        }
    }

    return (
        <AntdModal
            className={classNames(
                'custom-modal',
                className || '',
                'modal-' + size,
                {
                    'modal-body-p-0': bodyNotPadding,
                }
            )}
            title={title || ' '}
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            closable={closable}
            centered
            footer={footerShow ? [
                <div key="custom-btn" className={classNames({
                    'flex items-center gap-[8px] !pb-4 !pr-4 !pl-4 !mt-0': true,
                    'modal-footer-left': footerPosition === 'left',
                    'modal-footer-right': footerPosition === 'right',
                    'modal-footer-center': footerPosition === 'center',
                    'modal-footer-between': footerPosition === 'between',
                })}>
                    {footerButtons()}
                </div>
            ] : false}
            {...props}
        >
            {children}
        </AntdModal>
    );
};

export default Modal;