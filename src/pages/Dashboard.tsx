import {
    Badge,
    Button,
    Calendar,
    CalendarProps,
    Card,
    Col,
    Collapse,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Radio,
    Row,
    Select,
    Tabs
} from 'antd';
import React, {useCallback, useEffect, useState} from 'react';
import type {Dayjs} from 'dayjs';
import {Template} from "./Template";
import {useApi} from "../hooks/useApi";
import {Movimentacao} from "../types/Movimentacao";
import {Conta} from "../types/Conta";
import {SelectInfo} from "antd/es/calendar/generateCalendar";
import {CloseOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {Cartao} from "../types/Cartao";

const Dashboard: React.FC = () => {
    const api = useApi();

    const [contas, setContas] = useState<Conta[]>([]);
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
    const [verDetalheDia, setVerDetalheDia] = useState<boolean>(false);
    const [verCadastroMovimentacao, setVerCadastroMovimentacao] = useState<boolean>(false);
    const [diaSelecionado, setDiaSelecionado] = useState<Dayjs | undefined>(undefined);
    const [compraAVista, setCompraAVista] = useState<boolean>(true);
    const [cartoes, setCartoes] = useState<Cartao[]>([])

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
        setVerDetalheDia(true)
    };

    const cadastrarMovimentacao = (values: any) => {
        console.log(values);
    };

    const dialogCadastroMovimentacao = (
        <Modal open={verCadastroMovimentacao} title={'Cadastrar nova movimentação'} footer={[
            <Button key={'cancel'} id={'cancel-cadastro-movimentacao'} className={'cancel-button'} type={"default"}
                    htmlType={"reset"}
                    form={'formCadastroMovimentacao'} icon={<CloseOutlined/>}
                    onClick={() => setVerCadastroMovimentacao(false)}>
                Cancelar
            </Button>,
            <Button key={'save'} id={'save'} type={"primary"} htmlType={"submit"} form={'formCadastroMovimentacao'}
                    icon={<SaveOutlined/>}>
                Salvar
            </Button>,
        ]} onCancel={() => {
            let button = document.getElementById('cancel-cadastro-movimentacao');
            if (button) button.click();
            else setVerCadastroMovimentacao(false);
        }}>
            <Form name={'formCadastroMovimentacao'}
                  requiredMark={false} layout={"vertical"}
                  onFinish={cadastrarMovimentacao}>
                <Form.Item
                    label={'Conta'}
                    name={'idConta'}
                    rules={[{required: true, message: 'Defina a conta que receberá a movimentação!'}]}>
                    <Select placeholder={'Conta'} options={
                        new Array(contas.length).fill(null).map((_, index) => {
                            return {
                                value: contas[index].id,
                                label: contas[index].descricao
                            }
                        })}
                            onChange={value => {
                                api.listarCartoesPorConta(value)
                                    .then((response) => setCartoes(response))
                                    .catch((err) => console.error(err));
                            }}/>
                </Form.Item>
                <Form.Item
                    label={'Descrição'}
                    name={"descricao"}
                    rules={[{required: true, message: 'Defina uma descrição para identificar sua movimentação!'}]}>
                    <Input placeholder={'Descrição da movimentação'}/>
                </Form.Item>
                <Form.Item
                    label={'Data da movimentação'}
                    name={"dataEntrada"}
                    rules={[{required: true, message: 'Defina a data da movimentação!'}]}>
                    <DatePicker/>
                </Form.Item>
                <Radio.Group value={compraAVista} onChange={(e) => setCompraAVista(e.target.value)}>
                    <Radio value={true}>A vista</Radio>
                    <Radio value={false}>A prazo</Radio>
                </Radio.Group>
                {!compraAVista ? (
                    <div style={{marginTop: '14px'}}>
                        <Form.Item
                            label={'Parcelas'}
                            name={'parcelas'}>
                            <InputNumber id={'idInput'} placeholder={'Número de parcelas da compra'} defaultValue={1}
                                         min={1}/>
                        </Form.Item>
                        <Form.Item
                            label={'Cartão'}
                            name={'idCartao'}>
                            <Select placeholder={'Cartão'} options={
                                new Array(cartoes.length).fill(null).map((_, index) => {
                                    return {
                                        value: cartoes[index].id,
                                        label: cartoes[index].descricao
                                    }
                                })}/>
                        </Form.Item>
                    </div>
                ) : null}
            </Form>
        </Modal>
    )

    const dialogOptions = ([
            {
                label: 'Detalhes',
                key: 'detalhe',
                children: (
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
                )
            }
        ]
    );

    const dialogDetalhesDiaSelecionado = (
        <Modal open={verDetalheDia} title={diaSelecionado?.toDate().toDateString()} footer={[
            <Button key={'cancel'} id={'cancel-detalhe-data'} className={'cancel-button'} type={"default"}
                    htmlType={"reset"}
                    form={'formDetalhesData'} icon={<CloseOutlined/>} onClick={() => setVerDetalheDia(false)}>
                Cancelar
            </Button>,
            <Button key={'save'} id={'save'} type={"primary"} htmlType={"submit"} form={'formDetalhesData'}
                    icon={<SaveOutlined/>}>
                Salvar
            </Button>,
        ]} onCancel={() => {
            let button = document.getElementById('cancel-detalhe-data');
            if (button) button.click();
            else setVerDetalheDia(false);
        }}>
            <Tabs
                type={'card'} items={dialogOptions}/>
        </Modal>
    )

    const abrirCadastroMovimentacao = async () => {
        await api.listarCartoes()
            .then(value => setCartoes(value))
            .catch((err) => console.error(err));
        setVerCadastroMovimentacao(true);
    }

    return (
        <Template templateKey={'dashboard'}>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                {/*CALENDÁRIO*/}
                <Col span={'18'}>
                    <Calendar cellRender={cellRender} onSelect={abrirDialogData} style={{padding: "20px"}}/>
                </Col>
                {/*SALDO*/}
                <Col span={'6'}>
                    <Card title={(
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <span>Saldo</span>
                            <Button icon={<PlusOutlined/>} type={"primary"}
                                    onClick={abrirCadastroMovimentacao}>Nova movimentação</Button>
                        </div>
                    )}>
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
                {dialogDetalhesDiaSelecionado}
                {dialogCadastroMovimentacao}
            </Row>
        </Template>
    );
}

export default Dashboard;
