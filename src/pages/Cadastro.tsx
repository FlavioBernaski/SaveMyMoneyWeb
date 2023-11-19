import {Button, Checkbox, Form, Input, Menu} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import React, {useContext} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/Auth/AuthContext";

const Login: React.FC = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const cadastro = async (values: any) => {
        const isLogged = await auth.signin;
    };
    return (
        <div className={"principal"}>
        <Form name={"formLogin"}
              requiredMark={false}
              className={"login-form"}
              layout={"vertical"}
              initialValues={{remember: true,}}
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
                name="confirmacaoSenha"
                rules={[{required: true, message: 'Por favor, insira sua senha novamente!'}]}>
                <Input
                    type="password"
                    placeholder="Confirme sua senha"
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Cadastrar
                </Button>
                Já tem uma conta? <Link to="/login">Faça login!</Link>
            </Form.Item>
        </Form>
        </div>
    );
}

export default Login;
