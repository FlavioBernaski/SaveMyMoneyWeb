import {Badge, Calendar, CalendarProps} from 'antd';
import React, {useState} from 'react';
import type {Dayjs} from 'dayjs';
import {Template} from "./Template";
import {useApi} from "../hooks/useApi";
import {Gasto} from "../types/Gasto";

const Login: React.FC = () => {
    const api = useApi();

    const [listData, setListData] = useState<Gasto[]>([])

    const updateListData = async (month: number) => {
        await api.listarGastos().then((data) => setListData(data)).catch(() => setListData([]))
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
        let cell: React.ReactNode;
        updateListData(value.month()).then(() =>
            cell = (<ul className="events">
                    {listData.map((item) => (
                        <li key={item.id}>
                            <Badge text={item.descricao}/>
                        </li>
                    ))}
                </ul>
            )).catch(() =>
            cell = (<ul className="events">

            </ul>));
        return cell;
    };
    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info): React.ReactNode => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
    }

    return (
        <Template>
            <Calendar cellRender={cellRender} style={{padding: "20px"}}/>
        </Template>
    );
}

export default Login;
