import {Button, Checkbox, Form, Input, Menu} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import React, {useContext, useEffect, useState} from 'react';
import {Link, redirect, Route, useNavigate} from "react-router-dom";
import {Usuario} from "../types/Usuario";
import {AuthContext} from "../contexts/Auth/AuthContext";

const Login: React.FC = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const login = async (values: any) => {
        if (values.email && values.senha) {
            const isLogged = await auth.signin(values.email, values.senha);
            if (isLogged) {
                navigate("/");
            } else {
                alert("Deu ruim brother");
            }
        }
    };
    return (
        <Form name={"formLogin"}
              className={"login-form"}
              initialValues={{remember: true,}}
              onFinish={login}>
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
