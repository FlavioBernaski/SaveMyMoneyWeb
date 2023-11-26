import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import Login from './pages/Login';
import reportWebVitals from './reportWebVitals';
import {Button, ConfigProvider, Layout} from "antd";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Cadastro from "./pages/CadastroUsuario";
import {Footer} from "antd/es/layout/layout";
import Dashboard from "./pages/Dashboard";
import App from "./App";
import {AuthProvider} from "./contexts/Auth/AuthProvider";

const primaryColor: string = '#8f0ca3'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
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
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
