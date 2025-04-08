import './styles/index.css'
import {createRoot} from 'react-dom/client'
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import store from "@/store/index.jsx";
import { EventProvider } from "@/events/context/EventContext.jsx";
import AppProvider from "@/providers/AppProvider.jsx";

const root = createRoot(document.getElementById('root'));

const App = () => {
    return (
        <Provider store={store}>
            <ConfigProvider>
                <EventProvider>
                    <AppProvider />
                </EventProvider>
            </ConfigProvider>
        </Provider>
    )
}

root.render(<App />);
