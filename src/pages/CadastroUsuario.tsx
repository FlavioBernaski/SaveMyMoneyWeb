import {Button, Form, Input} from 'antd';
import React, {useContext} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/Auth/AuthContext";
import {Usuario} from "../types/Usuario";
import {useApi} from "../hooks/useApi";
import {getUUID} from "../utils/uuid";

const Login: React.FC = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const api = useApi();
    const cadastro = async (values: any) => {
        let novo: Usuario = new Usuario();
        if (values.senha !== values.confirmacaoSenha) {
            console.error("senhas divergentes");
            return;
        }
        novo.id = getUUID()
        novo.senha = values.senha;
        novo.nome = values.nome;
        novo.email = values.email;
        novo.versao = Date.now();
        const response = await api.signin(novo);
        if (response) {
            await auth.signin(values.email, values.senha);
            navigate("/")
        }
    };
    return (
        <div style={{display: "flex", flexDirection: 'column'}}>
            <img style={{margin: 'auto'}} alt={"Logo"} src={"logo192.png"}/>
            <Form name={"formCadastro"}
                  requiredMark={false}
                  className={"login-form"}
                  layout={"vertical"}
                  onFinish={cadastro}>
                <Form.Item
                    name={"email"}
                    label={"Email"}
                    rules={[{required: true, message: "Insira seu email para cadastrar!"}]}>
                    <Input placeholder={"augustosilva@email.com"}/>
                </Form.Item>
                <Form.Item
                    name={"nome"}
                    label={"Nome"}
                    rules={[{required: true, message: "Insira seu nome para cadastrar!"}]}>
                    <Input placeholder={"Augusto Silva"}/>
                </Form.Item>
                <Form.Item
                    name="senha"
                    label={"Senha"}
                    rules={[{required: true, message: 'Por favor, insira sua senha!'}]}>
                    <Input
                        type="password"
                        placeholder="Senha"
                    />
                </Form.Item>
                <Form.Item
                    id={"confirmacaoSenha"}
                    name={"confirmacaoSenha"}
                    rules={[{required: true, message: 'Por favor, insira sua senha novamente!'}]}>
                    <Input
                        type="password"
                        placeholder="Confirme sua senha"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type={"primary"} htmlType={"submit"} className={"login-form-button"}>
                        Cadastrar
                    </Button>
                    Já tem uma conta? <Link to="/login">Faça login!</Link>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;
