import {Button, Checkbox, Form, Input, Menu} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import React from 'react';
import {Link, redirect} from "react-router-dom";

const Login: React.FC = () => {
    const logar = (values: any) => {
        redirect("/");
    };
    return (
        <Form name={"formLogin"}
              className={"login-form"}
              initialValues={{remember: true,}}
              onFinish={logar}>
            <Form.Item
                name={"email"}
                rules={[{required: true, message: "Insira seu email para entrar!"}]}>
                <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Email"/>
            </Form.Item>
            <Form.Item
                name="senha"
                rules={[{required: true, message: 'Por favor, insira sua senha!'}]}>
                <Input
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    type="password"
                    placeholder="Senha"
                />
            </Form.Item>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Manter conectado</Checkbox>
                </Form.Item>
                <a className="login-form-forgot" href="">
                    Esqueci minha senha
                </a>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Entrar
                </Button>
                Não tem uma conta? <Link to="cadastro">Cadastre-se agora!</Link>
            </Form.Item>
        </Form>
    );
}

export default Login;
