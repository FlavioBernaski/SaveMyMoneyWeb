import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import {ConfigProvider} from "antd";
import {BrowserRouter} from 'react-router-dom';
import App from "./App";
import {AuthProvider} from "./contexts/Auth/AuthProvider";

const primaryColor: string = '#8f0ca3'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <AuthProvider>
        <BrowserRouter>
            <ConfigProvider theme={{
                token: {colorPrimary: primaryColor},
                components: {
                    Button: {colorPrimary: primaryColor}
                }
            }}>
                <App/>
            </ConfigProvider>
        </BrowserRouter>
    </AuthProvider>
);

reportWebVitals();
