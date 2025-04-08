import React, {useCallback, useEffect, useState} from 'react';
import {matchPath, useLocation} from "react-router";
import {useAuthStore} from "@/hooks/store/useStore.jsx";
import {translate} from "@/utils/localeUtil.jsx";
import {flatten} from "@/utils/helpersUtil.jsx";
import {getMenuItems, getRoutesByRole} from "@/routes/index.jsx";
import {Breadcrumb} from "@/components/ui/index.jsx";

function PageContainer(
    {
        children,
        blockRender,
        title,
        titleRender,
        customBreadcrumbItem,
    }
) {

    const {pathname} = useLocation();
    const {role} = useAuthStore();

    const [currentMenu, setCurrentMenu] = useState(false);
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);

    const menus = flatten(getMenuItems(role));
    const routes = flatten(getRoutesByRole(role));

    const findMatchingMenu = useCallback((pathname) => {
        return routes.find(item => {
            if (item.path.includes(':')) {
                return matchPath({
                    path: item.path,
                    end: true,
                    strict: false
                }, pathname);
            }
            return item.path === pathname;
        });
    }, [routes]);

    const initializationPathname = useCallback(() => {
        if (customBreadcrumbItem) {
            setBreadcrumbItems(customBreadcrumbItem);
            return;
        }

        const currentMenuItem = findMatchingMenu(pathname);

        if (!currentMenuItem) return;

        setCurrentMenu(currentMenuItem);

        if (!currentMenuItem.parent) {
            setBreadcrumbItems([{
                name: translate(currentMenuItem.label)
            }]);
            return;
        }

        const parentMenu = menus.find(item => {
            const [_, name] = item.name.split('.');
            return name === currentMenuItem.parent;
        });

        setBreadcrumbItems(
            parentMenu
                ? [
                    {name: translate(parentMenu.label)},
                    {name: translate(currentMenuItem.label)}
                ]
                : [{name: translate(currentMenuItem.label)}]
        );
    }, [menus, pathname, customBreadcrumbItem, findMatchingMenu]);

    useEffect(() => {
        initializationPathname();
    }, [pathname]);

    return (
        <>
            <div className="py-[24px] container mx-auto">
                <Breadcrumb items={breadcrumbItems}/>
                {(title || currentMenu?.label || titleRender) && (
                    <div className="flex items-center gap-[24px] justify-between">
                        <h1 className="font-agrandir h-[32px] flex items-center text-[24px] leading-[32px] font-bold">
                            {title || (currentMenu?.label && translate(currentMenu?.label)) || breadcrumbItems[0]?.name || ''}
                        </h1>
                        {titleRender && <div>{titleRender}</div>}
                    </div>
                )}
                {blockRender && <div className="mt-[8px]">{blockRender}</div>}
            </div>
            <div className="container mx-auto">
                {children}
            </div>
        </>
    );
}

export default PageContainer;