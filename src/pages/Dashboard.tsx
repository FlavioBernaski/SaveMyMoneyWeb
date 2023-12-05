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
    Popconfirm,
    Radio,
    Row,
    Select,
    Tabs
} from 'antd';
import React, {useCallback, useEffect, useState} from 'react';
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import {Template} from "./Template";
import {useApi} from "../hooks/useApi";
import {Movimentacao} from "../types/Movimentacao";
import {Conta} from "../types/Conta";
import {CalendarMode, SelectInfo} from "antd/es/calendar/generateCalendar";
import {CloseOutlined, DeleteOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {Cartao} from "../types/Cartao";
import {getUUID} from "../utils/uuid";
import "dayjs/plugin/localeData";
import locale from "antd/es/date-picker/locale/pt_BR";

dayjs.locale('pt-br');

const Dashboard: React.FC = () => {
    const api = useApi();

    const [contas, setContas] = useState<Conta[]>([]);
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
    const [verDetalheDia, setVerDetalheDia] = useState<boolean>(false);
    const [verCadastroMovimentacao, setVerCadastroMovimentacao] = useState<boolean>(false);
    const [compraAVista, setCompraAVista] = useState<boolean>(true);
    const [cartoes, setCartoes] = useState<Cartao[]>([]);
    const [diaSelecionado, setDiaSelecionado] = useState<Dayjs | undefined>(undefined);
    const [mesSelecionado, setMesSelecionado] = useState<number>(dayjs().month());
    const [anoSelecionado, setAnoSelecionado] = useState<number>(dayjs().year());
    const [entradaSaida, setEntradaSaida] = useState<"E" | "S">("S")
    const [totalMes, setTotalMes] = useState<number>(0);

    const atualizarListaMovimentacoes = useCallback(() => {
        let somaMes: number = 0;
        api.listarMovimentacoesFiltroAnoMes(anoSelecionado, mesSelecionado)
            .then((data) => {
                setMovimentacoes(data);
                (data as Movimentacao[]).forEach(d => (d.tipo === "S" ? somaMes -= d.valor : somaMes += d.valor))
                setTotalMes(somaMes);
            })
            .catch((err) => console.error(err.message));
    }, [anoSelecionado, api, mesSelecionado]);

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
                    <Badge status={item.tipo === 'E' ? 'success' : 'error'} text={item.descricao}/>
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
        if (info.source === 'date') {
            setDiaSelecionado(date);
            setVerDetalheDia(true);
        }
    };

    const cadastrarMovimentacao = async (values: any) => {
        const item = values as Movimentacao;
        item.id = getUUID();
        item.conta = await api.localizarConta(values.idConta);
        item.ativo = true;
        item.versao = Date.now();
        if (values.idCartao) {
            item.cartao = await api.localizarCartao(values.idCartao);
        }
        api.cadastrarMovimentacao(item)
            .then(() => {
                setVerCadastroMovimentacao(false);
                atualizarListaMovimentacoes();
            })
            .catch((err) => console.error(err));
    };

    const fecharCadastroMovimentacao = () => {
        setVerCadastroMovimentacao(false)
        setCartoes([]);
        setCompraAVista(true);
    }

    const dialogCadastroMovimentacao = (
        <Modal open={verCadastroMovimentacao} title={'Cadastrar nova movimentação'} footer={[
            <Button key={'cancel'} id={'cancel-cadastro-movimentacao'} className={'cancel-button'} type={"default"}
                    htmlType={"reset"}
                    form={'formCadastroMovimentacao'} icon={<CloseOutlined/>}
                    onClick={fecharCadastroMovimentacao}>
                Cancelar
            </Button>,
            <Button key={'save'} id={'save'} type={"primary"} htmlType={"submit"} form={'formCadastroMovimentacao'}
                    icon={<SaveOutlined/>}>
                Salvar
            </Button>,
        ]} onCancel={() => {
            let button = document.getElementById('cancel-cadastro-movimentacao');
            if (button) button.click();
            else fecharCadastroMovimentacao();
        }}>
            <Form name={'formCadastroMovimentacao'}
                  requiredMark={false} layout={"vertical"}
                  onFinish={cadastrarMovimentacao}>
                <Form.Item
                    label={''}
                    initialValue={'S'}
                    name={'tipo'}>
                    <Radio.Group
                        optionType={'button'}
                        buttonStyle={"solid"}
                        value={entradaSaida}
                        onChange={(e) => setEntradaSaida(e.target.value)}>
                        <Radio value={'S'}>Saída</Radio>
                        <Radio value={'E'}>Entrada</Radio>
                    </Radio.Group>
                </Form.Item>
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
                    label={'Valor'}
                    name={"valor"}
                    initialValue={0}
                    rules={[{required: true, message: 'Defina o valor da movimentação!'}]}>
                    <InputNumber prefix={'R$'} placeholder={'Descrição da movimentação'}/>
                </Form.Item>
                <Form.Item
                    label={'Data da movimentação'}
                    name={"dataEntrada"}
                    rules={[{required: true, message: 'Defina a data da movimentação!'}]}>
                    <DatePicker/>
                </Form.Item>
                <Radio.Group disabled={entradaSaida === "E"} value={compraAVista}
                             onChange={(e) => setCompraAVista(e.target.value)}>
                    <Radio value={true}>A vista</Radio>
                    <Radio value={false}>A prazo</Radio>
                </Radio.Group>
                {!compraAVista && entradaSaida === "S" ? (
                    <div style={{marginTop: '14px'}}>
                        <Form.Item
                            label={'Parcelas'}
                            name={'parcelas'}
                            initialValue={1}>
                            <InputNumber id={'idInput'} placeholder={'Número de parcelas da compra'} min={1}/>
                        </Form.Item>
                        <Form.Item
                            label={'Cartão'}
                            name={'idCartao'}
                            rules={[{required: true, message: "O cartão deve ser selecionado em compras a prazo"}]}>
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
                                <li key={index} style={{display: 'flex', alignItems: 'center'}}>
                                    <span>{value.descricao}: R${value.valor.toFixed(2)}</span>
                                    <Popconfirm title={"Exclusão de movimentação"}
                                                description={'Deseja mesmo excluir esse item?'}
                                                okText={'Sim'}
                                                onConfirm={() => {
                                                    api.excluirMovimentacao(value.id)
                                                        .then(() => atualizarListaMovimentacoes());
                                                }}
                                                cancelText={'Não'}>
                                        <Button className={'cancel-button'}
                                                icon={<DeleteOutlined/>}
                                                style={{marginLeft: 10}}>Excluir</Button>
                                    </Popconfirm>
                                </li>
                            ))}
                    </div>
                )
            }
        ]
    );

    const dialogDetalhesDiaSelecionado = (
        <Modal open={verDetalheDia} title={diaSelecionado?.toDate().toLocaleDateString()} footer={null}
               onCancel={() => {
                   setVerDetalheDia(false);
               }}>
            <Tabs
                type={'card'} items={dialogOptions}/>
        </Modal>
    )

    const abrirCadastroMovimentacao = async () => {
        setVerCadastroMovimentacao(true);
    }

    const headerCalendario = (
        {value, type, onChange, onTypeChange}: {
            value: Dayjs,
            type: CalendarMode,
            onChange: (date: Dayjs) => void,
            onTypeChange: (type: CalendarMode) => void
        }) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];

        let current = value.clone();
        const localeData = value.localeData();
        const months = [];
        for (let i = 0; i < 12; i++) {
            current = current.month(i);
            months.push(localeData.months(current));
        }

        for (let i = start; i < end; i++) {
            monthOptions.push(
                <Select.Option key={i} value={i} className="month-item">
                    {months[i]}
                </Select.Option>,
            );
        }

        const year = value.year();
        const month = value.month();
        const options = [];
        for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
                <Select.Option key={i} value={i} className="year-item">
                    {i}
                </Select.Option>,
            );
        }
        return (
            <div style={{
                padding: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2>Gastos do mês</h2>
                <Row gutter={8}>
                    <Button
                        type={"dashed"}
                        size={'large'}
                        onClick={() => {
                            const now = dayjs();
                            setMesSelecionado(now.month());
                            setAnoSelecionado(now.year());
                            onChange(now);
                        }}
                    >
                        Hoje
                    </Button>
                    <Col>
                        <Select
                            size={'large'}
                            bordered={false}
                            popupMatchSelectWidth={true}
                            value={month}
                            onChange={(newMonth) => {
                                const now = value.clone().month(newMonth);
                                setMesSelecionado(newMonth);
                                onChange(now);
                            }}
                        >
                            {monthOptions}
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            size={'large'}
                            bordered={false}
                            popupMatchSelectWidth={true}
                            value={year}
                            onChange={(newYear) => {
                                const now = value.clone().year(newYear);
                                setAnoSelecionado(newYear)
                                // atualizarListaMovimentacoes();
                                onChange(now);
                            }}
                        >
                            {options}
                        </Select>
                    </Col>
                </Row>
            </div>
        )
    }

    return (
        <Template templateKey={'dashboard'}>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                {/*CALENDÁRIO*/}
                <Col span={'18'}>
                    <Calendar cellRender={cellRender}
                              onSelect={abrirDialogData}
                              locale={locale}
                              style={{padding: "20px"}}
                              headerRender={headerCalendario}
                              onChange={(e) => {
                                  let alterou: boolean = false;
                                  if (diaSelecionado?.month() !== e.month()) {
                                      setMesSelecionado(e.month());
                                      alterou = true;
                                  }
                                  if (diaSelecionado?.year() !== e.year()) {
                                      setAnoSelecionado(e.year());
                                      alterou = true;
                                  }
                                  if (alterou) {
                                      atualizarListaMovimentacoes();
                                  }
                                  setDiaSelecionado(e)
                              }
                              }
                    />

                </Col>
                {/*SALDO*/
                }
                <Col span={'6'}>
                    <Card title={(
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
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
                                        <p key={index}>{movimentacao.descricao} -
                                            R$ {movimentacao.valor.toFixed(2)} - {movimentacao.tipo === 'S' ? movimentacao.cartao ? movimentacao.cartao.descricao : 'A vista' : 'Entrada'}</p>
                                    )
                                )
                            }
                        ))}/>
                        <p key="totalMes" title={'resto do mes'}>Saldo do mês: R${totalMes.toFixed(2)}</p>

                    </Card>
                </Col>
                {
                    dialogDetalhesDiaSelecionado
                }
                {
                    dialogCadastroMovimentacao
                }
            </Row>
        </Template>
    )
        ;
}

export default Dashboard;
