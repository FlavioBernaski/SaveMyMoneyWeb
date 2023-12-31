import {Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Table} from 'antd';
import React, {MouseEventHandler, useCallback, useContext, useEffect, useState} from 'react';
import {Template} from "./Template";
import {useApi} from "../hooks/useApi";
import {Cartao} from "../types/Cartao";
import {ColumnsType} from "antd/es/table";
import {CloseOutlined, DeleteOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {AuthContext} from "../contexts/Auth/AuthContext";
import {getUUID} from "../utils/uuid";
import {Conta} from "../types/Conta";

const Cartoes: React.FC = () => {
    const api = useApi();
    const auth = useContext(AuthContext);
    const [contas, setContas] = useState<Conta[]>([]);
    const [open, setOpen] = useState<boolean>(false)
    const [cartoes, setCartoes] = useState<Cartao[]>([])

    const atualizarListaCartoes = useCallback(() => {
        api.listarCartoes()
            .then((data) => setCartoes(data))
            .catch((err) => console.error(err.message));
    }, [api])

    const atualizarListaContas = useCallback(() => {
        api.listarContas()
            .then((data) => setContas(data))
            .catch((err) => console.error(err.message));
    }, [api])

    useEffect(() => {
        atualizarListaCartoes();
        atualizarListaContas();
    }, [atualizarListaCartoes, atualizarListaContas]);

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
            title: 'Conta',
            dataIndex: 'conta',
            key: 'conta',
            render: (_, item) => (
                <span>{item.conta.descricao}</span>
            )
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
            dataIndex: 'actions',
            render: (_, item) => (
                <Popconfirm title={"Exclusão de cartão"}
                            description={'Deseja mesmo excluir esse item?'}
                            okText={'Sim'}
                            onConfirm={() => {
                                api.excluirCartao(item.id)
                                    .then(() => atualizarListaCartoes())
                                    .catch((err) => console.error(err.message));
                            }}>
                    <Button icon={<DeleteOutlined/>} className={'cancel-button'}>Excluir</Button>
                </Popconfirm>
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
                setOpen(false);
                atualizarListaCartoes();
            })
            .catch((err) => console.error(err));
    }

    const dialogCadastroCartoes = (
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
                  preserve={false}
                  onFinish={(e) => {
                      cadastrar(e);
                      let button = document.getElementById('cancel');
                      if (button) button.click();
                      else setOpen(false);
                  }}>
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
                    initialValue={1}
                    rules={[{required: true, message: 'Defina quando o cartão irá virar!'}]}>
                    <InputNumber min={1} max={31}/>
                </Form.Item>
            </Form>
        </Modal>
    );

    return (
        <Template templateKey={'cartoes'}>
            <div className={'content'}>
                <span className={'title'}>Cartões</span>
                <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => setOpen(true)}
                        style={{float: "right"}}>Novo</Button>
                <Table columns={columns} dataSource={cartoes}/>
                {dialogCadastroCartoes}
            </div>
        </Template>
    );
}

export default Cartoes;
