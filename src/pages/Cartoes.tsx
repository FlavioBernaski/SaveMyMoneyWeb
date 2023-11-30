import {Button, Form, Input, InputNumber, Modal, Select, Table} from 'antd';
import React, {MouseEventHandler, useContext, useEffect, useState} from 'react';
import {Template} from "./Template";
import {useApi} from "../hooks/useApi";
import {Cartao} from "../types/Cartao";
import {ColumnsType} from "antd/es/table";
import {CloseOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {AuthContext} from "../contexts/Auth/AuthContext";
import {getUUID} from "../utils/uuid";
import {Conta} from "../types/Conta";

const Cartoes: React.FC = () => {
    const api = useApi();
    const auth = useContext(AuthContext);
    const [contas, setContas] = useState<Conta[]>([]);
    const [open, setOpen] = useState<boolean>(false)
    const [cartoes, setCartoes] = useState<Cartao[]>([])
    useEffect(() => {
        atualizarListaCartoes();
        atualizarListaContas();
    }, []);

    const atualizarListaCartoes = (): void => {
        api.listarCartoes()
            .then((data) => setCartoes(data))
            .catch((err) => console.error(err.message));
    }

    const atualizarListaContas = (): void => {
        api.listarContas()
            .then((data) => setContas(data))
            .catch((err) => console.error(err.message));
    }

    const excluirCartao = (item: Cartao): MouseEventHandler => {
        return () => {
            api.excluirCartao(item.id)
                .then(() => atualizarListaCartoes())
                .catch((err) => console.error(err.message));
        }
    }

    const columns: ColumnsType<Cartao> = [
        {
            title: 'Descrição',
            dataIndex: 'descricao',
            key: 'desc'
        },
        {
            title: 'Vencimento',
            dataIndex: 'vencimentoFatura',
            key: 'venc'
        },
        {
            title: 'Limite',
            dataIndex: 'limite',
            key: 'limite',
            render: (_, item) => (
                <span>{'R$ '.concat(item.limite.toFixed(2))}</span>
            )
        },
        {
            title: '',
            key: 'actions',
            render: (_, item) => (
                <span onClick={excluirCartao(item)}>Excluir</span>
            )
        }
    ]

    const cadastrar = async (values: any) => {
        if (auth.usuario === null) return;
        const item = values as Cartao;
        item.id = getUUID();
        item.conta = await api.localizarConta(values.idConta)
        item.ativo = true;
        item.versao = Date.now();
        api.cadastrarCartao(item)
            .then(() => {
                setOpen(false)
                atualizarListaCartoes();
            })
            .catch((err) => console.error(err));
    }

    return (
        <Template templateKey={'cartoes'}>
            <div className={'content'}>
                <span className={'title'}>Cartões</span>
                <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => setOpen(true)}
                        style={{float: "right"}}>Novo</Button>
                <Table columns={columns} dataSource={cartoes}/>
                <Modal open={open} title={"Cadastro de cartão"} footer={[
                    <Button id={'cancel'} className={'cancel-button'} type={"default"} htmlType={"reset"}
                            form={'formCadastroCartao'} icon={<CloseOutlined/>} onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>,
                    <Button id={'save'} type={"primary"} htmlType={"submit"} form={'formCadastroCartao'}
                            icon={<SaveOutlined/>}>
                        Salvar
                    </Button>,
                ]} onCancel={() => {
                    let button = document.getElementById('cancel');
                    if (button) button.click();
                    else setOpen(false);
                }}>
                    <Form name={"formCadastroCartao"}
                          className={"cadastro-cartao"}
                          requiredMark={false} layout={"vertical"}
                          onFinish={cadastrar}>
                        <Form.Item
                            label={'Conta'}
                            name={"idConta"}
                            rules={[{required: true, message: 'Defina a conta do seu cartão!'}]}>
                            <Select placeholder={'Conta'} options={
                                new Array(contas.length).fill(null).map((_, index) => {
                                    return {
                                        value: contas[index].id,
                                        label: contas[index].descricao
                                    }
                            })} />
                        </Form.Item>
                        <Form.Item
                            label={'Nome do cartão'}
                            name={"descricao"}
                            rules={[{required: true, message: 'Defina um nome para identificar seu cartão!'}]}>
                            <Input placeholder={'Apelido do cartão'}/>
                        </Form.Item>
                        <Form.Item
                            label={'Limite'}
                            name={'limite'}
                            rules={[{required: true, message: 'Defina o limite do seu cartão!'}]}>
                            <Input type={'number'} placeholder={'12.00'} prefix={"R$"}/>
                        </Form.Item>
                        <Form.Item
                            label={'Dia de vencimento da fatura'}
                            name={'vencimentoFatura'}
                            rules={[{required: true, message: 'Defina quando o cartão irá virar!'}]}>
                            <InputNumber min={1} max={31} defaultValue={1}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Template>
    );
}

export default Cartoes;
