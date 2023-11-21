import { Modal } from "antd";
import React, {useState} from "react";
import {useApi} from "../hooks/useApi";
import {Cartao} from "../types/Cartao";

const CadastroCartao: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const api = useApi();
    const cadastrar = async (values: any) => {
        var cartao: Cartao = new Cartao();
        await api.cadastrarCartao(cartao);
    }
    return (
        <Modal open={open} title={"Cadastro de cartão"} onOk={cadastrar}>
        </Modal>
    );
}
export default CadastroCartao;