import {Layout, Menu, MenuProps} from 'antd';
import React, {useContext, useState} from 'react';
import {CalendarOutlined, CreditCardOutlined, LogoutOutlined} from "@ant-design/icons";
import {AuthContext} from "../contexts/Auth/AuthContext";
import {useNavigate} from "react-router-dom";

const {Header, Content, Footer} = Layout;

export const Template = ({templateKey ,children}: { templateKey: any, children: JSX.Element }) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const items: MenuProps['items'] = [
        {
            label: 'Dashboard',
            key: 'dashboard',
            icon: <CalendarOutlined/>
        },
        {
            label: 'Cartões',
            key: 'cartoes',
            icon: <CreditCardOutlined/>
        },
        {
            label: 'Sair',
            key: 'sair',
            icon: <LogoutOutlined/>
        }
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case 'sair':
                auth.signout();
                break;
            case 'cartoes':
                navigate('/cartoes');
                break;
            case 'dashboard':
                navigate('/');
                break;
        }
    }

    return (
        <Layout>
            <Header className={"layout-header"}>
                <Menu theme={"dark"} mode={"horizontal"} items={items} onClick={onClick} selectedKeys={[templateKey]}/>
            </Header>
            <Content className={'layout-content'}>
                {children}
            </Content>
        </Layout>
    );
}
