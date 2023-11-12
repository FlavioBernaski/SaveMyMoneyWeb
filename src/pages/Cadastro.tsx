import {Button, Checkbox, Form, Input, Menu} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import React from 'react';
import {Link} from "react-router-dom";

const Login: React.FC = () => {
    const logar = (values: any) => {

    };
    return (
        <div className={"principal"}>
        <Form name={"formLogin"}
              requiredMark={false}
              className={"login-form"}
              layout={"vertical"}
              initialValues={{remember: true,}}
              onFinish={logar}>
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
                Já tem uma conta? <Link to="/cadastro">Faça login!</Link>
            </Form.Item>
        </Form>
        </div>
    );
}

export default Login;
