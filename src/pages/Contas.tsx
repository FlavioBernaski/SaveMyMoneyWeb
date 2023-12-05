import {Button, Form, Input, Modal, Popconfirm, Table} from 'antd';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Template} from "./Template";
import {useApi} from "../hooks/useApi";
import {ColumnsType} from "antd/es/table";
import {CloseOutlined, DeleteOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {AuthContext} from "../contexts/Auth/AuthContext";
import {getUUID} from "../utils/uuid";
import {Conta} from "../types/Conta";

const Contas: React.FC = () => {
    const api = useApi();
    const auth = useContext(AuthContext);
    const [contas, setContas] = useState<Conta[]>([]);
    const [open, setOpen] = useState<boolean>(false)

    const atualizarListaContas = useCallback(() => {
        api.listarContas()
            .then((data) => setContas(data))
            .catch((err) => console.error(err.message));
    }, [api]);

    useEffect(() => {
        atualizarListaContas();
    }, [atualizarListaContas]);

    const columns: ColumnsType<Conta> = [
        {
            title: 'Descrição',
            dataIndex: 'descricao',
            key: 'desc'
        },
        {
            title: 'Saldo',
            dataIndex: 'saldo',
            key: 'saldo',
            render: (_, item) => (
                <span>{'R$ '.concat(item.saldo.toFixed(2))}</span>
            )
        },
        {
            title: '',
            key: 'actions',
            dataIndex: 'actions',
            render: (_, item) => (
                <Popconfirm title={"Exclusão de conta"}
                            description={'Deseja mesmo excluir esse item?'}
                            okText={'Sim'}
                            onConfirm={() => {
                                api.excluirConta(item.id)
                                    .then(() => atualizarListaContas())
                                    .catch((err) => console.error(err.message));
                            }}>
                    <Button icon={<DeleteOutlined/>} className={'cancel-button'}>Excluir</Button>
                </Popconfirm>
            )
        }
    ]

    const cadastrar = async (values: any) => {
        if (auth.usuario === null) return;
        const item = values as Conta;
        item.id = getUUID();
        item.usuario = auth.usuario;
        item.ativo = true;
        item.versao = Date.now();
        api.cadastrarConta(item)
            .then(() => {
                setOpen(false)
                atualizarListaContas();
            })
            .catch((err) => console.error(err));
    }

    const dialogCadastroContas = (
        <Modal open={open} title={"Cadastro de conta"} footer={[
            <Button key={'cancel'} id={'cancel'} className={'cancel-button'} type={"default"} htmlType={"reset"}
                    form={'formCadastroContas'} icon={<CloseOutlined/>} onClick={() => setOpen(false)}>
                Cancelar
            </Button>,
            <Button key={'save'} id={'save'} type={"primary"} htmlType={"submit"} form={'formCadastroContas'}
                    icon={<SaveOutlined/>}>
                Salvar
            </Button>,
        ]} onCancel={() => {
            let button = document.getElementById('cancel');
            if (button) button.click();
            else setOpen(false);
        }}>
            <Form name={"formCadastroContas"}
                  className={"cadastro-cartao"}
                  requiredMark={false} layout={"vertical"}
                  onFinish={(e) => {
                      cadastrar(e);
                      let button = document.getElementById('cancel');
                      if (button) button.click();
                      else setOpen(false);
                  }}>
                <Form.Item
                    label={'Nome da conta'}
                    name={"descricao"}
                    rules={[{required: true, message: 'Defina um nome para identificar sua conta!'}]}>
                    <Input placeholder={'Apelido da conta'}/>
                </Form.Item>
                <Form.Item
                    label={'Saldo'}
                    name={'saldo'}
                    rules={[{required: true, message: 'Defina o saldo atual da sua conta!'}]}>
                    <Input type={'number'} placeholder={'12.00'} prefix={"R$"}/>
                </Form.Item>
            </Form>
        </Modal>
    );

    return (
        <Template templateKey={'contas'}>
            <div className={'content'}>
                <span className={'title'}>Contas</span>
                <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => setOpen(true)}
                        style={{float: "right"}}>Novo</Button>
                <Table columns={columns} dataSource={contas}/>
                {dialogCadastroContas}
            </div>
        </Template>
    );
}

export default Contas;
