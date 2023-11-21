import {Badge, Calendar, CalendarProps} from 'antd';
import React, {useEffect, useState} from 'react';
import type {Dayjs} from 'dayjs';
import {Template} from "./Template";
import {useApi} from "../hooks/useApi";
import {Gasto} from "../types/Gasto";

const Dashboard: React.FC = () => {
    const api = useApi();

    const [listData, setListData] = useState<Gasto[]>([])
    useEffect(() => {
        api.listarGastos()
            .then((data) => setListData(data))
            .catch((err) => console.error(err.message));
    }, []);

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
        var totalGasto: number = 0;
        let filteredList: Gasto[] = listData.filter((data) => new Date(data.dataEntrada).toDateString() === value.toDate().toDateString())
        filteredList.map((data) => {
            filteredList.forEach((i) => {
                totalGasto += i.valor
            })
            cell = (<ul className="events" title={"R$" + totalGasto.toFixed(2)}>
                {listData.map((item) => (
                    <li key={item.id}>
                        <Badge status={'success'} text={item.descricao}/>
                    </li>
                ))}
            </ul>)
        })
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

export default Dashboard;
