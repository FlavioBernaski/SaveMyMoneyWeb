import {Button, Form, Input, InputNumber, Modal, Table} from 'antd';
import React, {MouseEventHandler, useContext, useEffect, useState} from 'react';
import {Template} from "./Template";
import {useApi} from "../hooks/useApi";
import {Cartao} from "../types/Cartao";
import {ColumnsType} from "antd/es/table";
import {CloseOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {AuthContext} from "../contexts/Auth/AuthContext";
import {getUUID} from "../utils/uuid";

const Cartoes: React.FC = () => {
    const api = useApi();
    const auth = useContext(AuthContext);
    const [open, setOpen] = useState<boolean>(false)
    const [data, setData] = useState<Cartao[]>([])
    useEffect(() => {
        atualizarLista()
    }, []);

    const atualizarLista = (): void => {
        api.listarCartoes()
            .then((data) => setData(data))
            .catch((err) => console.error(err.message));
    }

    const excluirCartao = (item: Cartao): MouseEventHandler => {
        return () => {
            api.excluirCartao(item.id)
                .then(() => atualizarLista())
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
            title: '',
            key: 'actions',
            render: (_, item) => (
                <span onClick={excluirCartao(item)}>Excluir</span>
            )
        }
    ]

    const cadastrar = (values: any) => {
        if (auth.usuario === null) return;
        const item = values as Cartao;
        item.id = getUUID();
        item.usuario = auth.usuario;
        item.ativo = true;
        item.versao = Date.now();
        api.cadastrarCartao(item)
            .then(() => {
                setOpen(false)
                atualizarLista();
            })
            .catch((err) => console.error(err));
    }

    return (
        <Template templateKey={'cartoes'}>
            <div className={'content'}>
                <span className={'title'}>Cartões</span>
                <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => setOpen(true)}
                        style={{float: "right"}}>Novo</Button>
                <Table columns={columns} dataSource={data}/>
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
