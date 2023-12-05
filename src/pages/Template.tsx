import {Layout, Menu, MenuProps} from 'antd';
import React, {useContext} from 'react';
import {CalendarOutlined, CreditCardOutlined, LogoutOutlined, MoneyCollectOutlined} from "@ant-design/icons";
import {AuthContext} from "../contexts/Auth/AuthContext";
import {useNavigate} from "react-router-dom";

const {Header, Content, Footer} = Layout;

export const Template = ({templateKey, children}: { templateKey: any, children: JSX.Element }) => {
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
            label: 'Contas',
            key: 'contas',
            icon: <MoneyCollectOutlined/>
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
            case 'contas':
                navigate('/contas');
                break;
            case 'rendas':
                navigate('/rendas');
                break;
        }
    }

    return (
        <Layout className={'layout'}>
            <Header className={"layout-header"}>
                <Menu theme={"dark"} mode={"horizontal"} items={items} style={{minWidth: '900px'}} onClick={onClick}
                      defaultSelectedKeys={[templateKey]}/>
                <span className={'usuario-logado'}>Logado como {auth.usuario?.nome}</span>
            </Header>
            <Content className={'layout-content'}>
                {children}
            </Content>
            <Footer className={'layout-footer'}>
                Criado por Flávio Bernaski
            </Footer>
        </Layout>
    );
}
