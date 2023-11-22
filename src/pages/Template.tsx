import {Layout, Menu, MenuProps} from 'antd';
import React, {useContext, useState} from 'react';
import {CalendarOutlined, CreditCardOutlined, LogoutOutlined} from "@ant-design/icons";
import {AuthContext} from "../contexts/Auth/AuthContext";
import {useNavigate} from "react-router-dom";

const {Header, Content, Footer, Sider} = Layout;


export const Template = ({children}: { children: JSX.Element }) => {
    const [collapsed, setCollapsed] = useState(false);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <Layout hasSider={true}>
            <Sider collapsible={true} collapsed={collapsed}
                   onCollapse={(value) => {
                       setCollapsed(value)
                   }}
                   className={"menu-sider"}
                   style={{overflow: "auto", height: "100hv", position: "fixed", left: 0, top: 0, bottom: 0}}>
                <Menu theme={"dark"} mode={"inline"}>
                    <Menu.Item key={"1"} onClick={() => navigate("/")}>
                        <CalendarOutlined />
                        <span>Dashboard</span>
                    </Menu.Item>
                    <Menu.Item key={"2"} onClick={() => navigate("/cartoes")}>
                        <CreditCardOutlined/>
                        <span>Cartões</span>
                    </Menu.Item>
                    <Menu.Item key={"3"} onClick={auth.signout}>
                        <LogoutOutlined/>
                        <span>Sair</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout style={{marginLeft: collapsed ? 100 : 200}}>
                <Content>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
