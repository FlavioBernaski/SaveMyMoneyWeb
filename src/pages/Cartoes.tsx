import {Button, Table} from 'antd';
import React, {MouseEventHandler, useEffect, useState} from 'react';
import {Template} from "./Template";
import {useApi} from "../hooks/useApi";
import {Cartao} from "../types/Cartao";
import {ColumnsType} from "antd/es/table";
import {PlusOutlined} from "@ant-design/icons";

const Dashboard: React.FC = () => {
    const api = useApi();

    const [data, setData] = useState<Cartao[]>([])
    useEffect(() => {
        api.listarCartoes()
            .then((data) => setData(data))
            .catch((err) => console.error(err.message));
    }, []);

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

    return (
        <Template>
            <div className={'content'}>
                <span className={'title'}>Cartões</span>
                <Button type={"primary"} icon={<PlusOutlined/>} style={{float: "right"}}>Novo</Button>
                <Table columns={columns} dataSource={data}/>
            </div>
        </Template>
    );
}

export default Dashboard;
