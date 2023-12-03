import {Badge, Button, Calendar, CalendarProps, Card, Col, Collapse, Form, Modal, Row, Tabs} from 'antd';
import React, {useCallback, useEffect, useState} from 'react';
import type {Dayjs} from 'dayjs';
import {Template} from "./Template";
import {useApi} from "../hooks/useApi";
import {Movimentacao} from "../types/Movimentacao";
import {Conta} from "../types/Conta";
import {SelectInfo} from "antd/es/calendar/generateCalendar";
import {CloseOutlined, SaveOutlined} from "@ant-design/icons";

const Dashboard: React.FC = () => {
    const api = useApi();

    const [contas, setContas] = useState<Conta[]>([]);
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
    const [open, setOpen] = useState<boolean>(false);
    const [diaSelecionado, setDiaSelecionado] = useState<Dayjs | undefined>(undefined)
    const [tipoDataSelecionada, setTipoDataSelecionada] = useState<SelectInfo | undefined>(undefined)

    const atualizarListaMovimentacoes = useCallback(() => {
        api.listarMovimentacoes()
            .then((data) => setMovimentacoes(data))
            .catch((err) => console.error(err.message));
    }, [api]);

    const atualizarListaContas = useCallback(() => {
        api.listarContas()
            .then((data) => setContas(data))
            .catch((err) => console.error(err.message));
    }, [api]);

    useEffect(() => {
        atualizarListaMovimentacoes();
        atualizarListaContas();
        console.log('w')
    }, [atualizarListaMovimentacoes, atualizarListaContas]);

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
        let filteredList: Movimentacao[] = movimentacoes.filter(
            (data) => new Date(data.dataEntrada).toDateString() === value.toDate().toDateString())
        filteredList.forEach((i) => {
            totalGasto += i.valor
        })
        cell = (<ul className="events" title={"R$" + totalGasto.toFixed(2)}>
            {filteredList.map((item) => (
                <li key={item.id}>
                    <Badge status={'success'} text={item.descricao}/>
                </li>
            ))}
        </ul>)
        return cell;
    };
    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info): React.ReactNode => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
    }

    const abrirDialogData = (date: Dayjs, info: SelectInfo) => {
        setDiaSelecionado(date);
        setTipoDataSelecionada(info);
        setOpen(true)
    };

    const detalhesDiaSelecionado = (
        <div>
            {movimentacoes
                .filter(m =>
                    new Date(m.dataEntrada).toDateString() === diaSelecionado?.toDate().toDateString())
                .map((value, index) => (
                    <li key={index}>
                        <span>{value.descricao}</span>
                    </li>
                ))}
        </div>
    );

    const formNovaMovimentacao = (
        <Form>

        </Form>
    )

    const dialogOptions = ([
            {
                label: 'Detalhes',
                key: 'detalhe',
                children: detalhesDiaSelecionado
            },
            {
                label: 'Nova movimentação',
                key: 'novaMovimentacao',
                children: formNovaMovimentacao
            }
        ]
    );

    const dialog = (
        <Modal open={open} title={diaSelecionado?.toDate().toDateString()} footer={[
            <Button key={'cancel'} id={'cancel'} className={'cancel-button'} type={"default"} htmlType={"reset"}
                    form={'formDetalhesData'} icon={<CloseOutlined/>} onClick={() => setOpen(false)}>
                Cancelar
            </Button>,
            <Button key={'save'} id={'save'} type={"primary"} htmlType={"submit"} form={'formDetalhesData'}
                    icon={<SaveOutlined/>}>
                Salvar
            </Button>,
        ]} onCancel={() => {
            let button = document.getElementById('cancel');
            if (button) button.click();
            else setOpen(false);
        }}>
            <Tabs
                type={'card'} items={dialogOptions}/>
        </Modal>
    )

    return (
        <Template templateKey={'dashboard'}>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                {/*CALENDÁRIO*/}
                <Col span={'18'}>
                    <Calendar cellRender={cellRender} onSelect={abrirDialogData} style={{padding: "20px"}}/>
                </Col>
                {/*SALDO*/}
                <Col span={'6'}>
                    <Card title={'Saldo'}>
                        <Collapse accordion={true} items={contas.map((item, index) => (
                            {
                                key: index,
                                label: item.descricao,
                                children: movimentacoes.filter(m => m.conta.id === item.id).map(
                                    (movimentacao, index) => (
                                        <p key={index}>{movimentacao.descricao} - R$ {movimentacao.valor.toFixed(2)}</p>
                                    )
                                )
                            }
                        ))}/>
                    </Card>
                </Col>
                {dialog}
            </Row>
        </Template>
    );
}

export default Dashboard;
