import {useRouteChange} from "@/hooks/router/useRouteChange.jsx";

function RouteProvider({children}) {

    useRouteChange();

    return children
}

export default RouteProvider;