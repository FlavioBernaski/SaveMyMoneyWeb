import {Badge, Calendar, CalendarProps, Card, Col, Row} from 'antd';
import React, {useEffect, useState} from 'react';
import type {Dayjs} from 'dayjs';
import {Template} from "./Template";
import {useApi} from "../hooks/useApi";
import {Movimentacao} from "../types/Movimentacao";
import {Conta} from "../types/Conta";

const Dashboard: React.FC = () => {
    const api = useApi();

    const [contas, setContas] = useState<Conta[]>([]);
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
    useEffect(() => {
        atualizarListaMovimentacoes();
        atualizarListaContas()
    }, []);

    const atualizarListaMovimentacoes = (): void => {
        api.listarMovimentacoes()
            .then((data) => setMovimentacoes(data))
            .catch((err) => console.error(err.message));
    }

    const atualizarListaContas = (): void => {
        api.listarContas()
            .then((data) => setContas(data))
            .catch((err) => console.error(err.message));
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
        var totalGasto: number = 0;
        let filteredList: Movimentacao[] = movimentacoes.filter((data) => new Date(data.dataEntrada).toDateString() === value.toDate().toDateString())
        filteredList.map((data) => {
            filteredList.forEach((i) => {
                totalGasto += i.valor
            })
            cell = (<ul className="events" title={"R$" + totalGasto.toFixed(2)}>
                {movimentacoes.map((item) => (
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
        <Template templateKey={'dashboard'}>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col span={'18'}>
                    <Calendar cellRender={cellRender} style={{padding: "20px"}}/>
                </Col>
                <Col span={'6'}>
                    <Card title={'Saldo'}>
                        {contas.map(item => (
                            <div>
                                <p>{item.descricao} - Saldo {item.saldo}</p>
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>
        </Template>
    );
}

export default Dashboard;
