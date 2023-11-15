import {Badge, BadgeProps, Calendar, CalendarProps, Layout, Menu} from 'antd';
import React, {useState} from 'react';
import {MenuProps} from "antd/lib";
import type {Dayjs} from 'dayjs';
import {
    DesktopOutlined,
    FileOutlined,
    LogoutOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined
} from "@ant-design/icons";

const {Header, Content, Footer, Sider} = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const Login: React.FC = () => {

    const getListData = (value: Dayjs) => {
        let listData;
        return [{type: "warning", content: "algo"}];
    }
    const monthCellRender = (value: Dayjs) => {
        const num = value.get("month");
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge status={item.type as BadgeProps['status']} text={item.content}/>
                    </li>
                ))}
            </ul>
        );
    };
    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
    }

    const [collapsed, setCollapsed] = useState(false);

    const items: MenuItem[] = [
        getItem('Option 1', '1', <PieChartOutlined/>),
        getItem('Option 2', '2', <DesktopOutlined/>),
        getItem('User', 'sub1', <UserOutlined/>, [
            getItem('Tom', '3'),
            getItem('Bill', '4'),
            getItem('Alex', '5'),
        ]),
        getItem('Team', 'sub2', <TeamOutlined/>, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
        getItem('Files', '9', <FileOutlined/>),
        getItem('Sair', '10', <LogoutOutlined/>),
    ];

    return (
        <Layout hasSider={true}>
            <Sider collapsible={true} collapsed={collapsed}
                   onCollapse={(value) => {
                       setCollapsed(value)
                   }}
                   className={"menu-sider"} style={{overflow: "auto", height: "100hv",position: "fixed", left: 0, top: 0, bottom: 0}}>
                <Menu theme={"dark"} mode={"inline"} items={items}/>
            </Sider>
            <Layout style={{marginLeft: collapsed ? 100 : 200}}>
                <Content>
                    <Calendar cellRender={cellRender} style={{padding: "20px"}}/>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Login;
