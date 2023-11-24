import {Button, Form, Input, InputNumber, Modal, Table} from 'antd';
import React, {MouseEventHandler, useEffect, useState} from 'react';
import {Template} from "./Template";
import {useApi} from "../hooks/useApi";
import {Cartao} from "../types/Cartao";
import {ColumnsType} from "antd/es/table";
import {CloseOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";

const Cartoes: React.FC = () => {
    const api = useApi();

    const [open, setOpen] = useState<boolean>(false)
    const [data, setData] = useState<Cartao[]>([])
    useEffect(() => {
        api.listarCartoes()
            .then((data) => setData(data))
            .catch((err) => console.error(err.message));
    }, [api]);

    const excluirCartao = (item: Cartao): MouseEventHandler => {
        return () => {
            api.excluirCartao(item.id)
                .then(() => console.log("Excluido com sucesso"))
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
        console.log(values);
    }

    return (
        <Template>
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
                          onFinish={cadastrar}>
                        <Form.Item
                            name={"nome"}
                            rules={[{required: true, message: 'Defina um nome para identificar seu cartão!'}]}>
                            <Input placeholder={'Apelido do cartão'}/>
                        </Form.Item>
                        <Form.Item
                            name={'limite'}
                            rules={[{required: true, message: 'Defina o limite do seu cartão!'}]}>
                            <InputNumber
                                controls={false}
                                decimalSeparator={'.'}

                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Template>
    );
}

export default Cartoes;
