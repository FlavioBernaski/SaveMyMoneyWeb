import {Layout, Menu} from 'antd';
import React from 'react';
import Sider from "antd/lib/layout/Sider";
import {MenuProps} from "antd/lib";
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined, ShopOutlined, TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined
} from "@ant-design/icons";

const Login: React.FC = () => {
    const items: MenuProps['items'] = [
        UserOutlined,
        VideoCameraOutlined,
        UploadOutlined,
        BarChartOutlined,
        CloudOutlined,
        AppstoreOutlined,
        TeamOutlined,
        ShopOutlined,
    ].map((icon, index) => ({
        key: String(index + 1),
        icon: React.createElement(icon),
        label: `nav ${index + 1}`,
    }));
    return (
        <Layout>
            <Sider style={{
                overflow:"auto",
                height:"100vh",
                position: "fixed"
            }}>
                <Menu theme={"dark"} mode={"inline"} items={items}/>
            </Sider>
        </Layout>
    );
}

export default Login;
