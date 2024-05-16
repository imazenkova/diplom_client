import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, Switch } from "antd";
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from '../../AppContext';
import { ContextType, State } from '../../Reduser';
import { AuthApi } from '../../api/auth.api.cli';
import { ApiError } from '../../shared.lib/api/errors';
import ForgotPassword from './ForgotPassword';
import { AppSettig } from '../../app.setting';

interface SignInProps {
  onTabChange: (tab: string) => void;
}

const SignIn: React.FC<SignInProps> = ({ onTabChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const { message } = App.useApp();

  const navigate = useNavigate();

  const { state, dispatch } = useContext<ContextType>(AppContext);
  const redirectUrl = state?.redirectUrl;

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await AuthApi.login({ email, password });
      if (dispatch) {
        const maxAge = remember ? AppSettig.maxAgeAuth : 1 * 24 * 60 * 60 * 1000;
        dispatch({ type: State.BEARER_TOKEN, payload: result.token, maxAge: maxAge });
        dispatch({ type: State.PROFILE, payload: result });
        if (redirectUrl && redirectUrl !== AppSettig.routePath.auth) {
          navigate(redirectUrl);
        } else {
          navigate('/');
        }
      }
    } catch (e) {
      const ae = ApiError.FromAxios(e);
      if (ae.aexCode === 'auth.UserNotExist') {
        message.error(`${state?.l.errors.UserNotExist}`);
      } else if (ae.aexCode === 'auth.ErrPassword') {
        message.error(`${state?.l.errors.ErrPassword}`);
      } else if (ae.aexCode === 'auth.emailNotVerified') {
        message.error(`${state?.l.errors.emailNotVerified}`);
      } else if (ae.aexCode === 'net.NotNetwork') {
        message.error(state?.l.errors.notNetwork);
      } else {
        message.error(ae.getMessages().map(e => <>{e}<br /></>))
      }
    } finally {
      setIsLoading(false);
    }
  }
  const onChangeRemember = (checked: any) => {
    setRemember(checked);
  };

  return (
    <>
      <Form
        style={{ width: "23rem" }}
        initialValues={{ remember: true }}
        onFinish={handleLogin}

      >
        {/* <Title level={5}>{state?.l.login.loginInfo}</Title> */}
        <Form.Item
          name="email"
          rules={[{ required: true, message: state?.l.signUp.inputEmail }]}
        >
          <Input
            type="email"
            prefix={<><MailOutlined style={{ color: 'gray' }} /><span> </span></>}
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            placeholder={state?.l.signUp.email}
            disabled={isLoading}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: state?.l.signUp.inputPassword }]}
        >
          <Input.Password
            prefix={<><LockOutlined style={{ color: 'gray' }} /><span> </span></>}
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
            disabled={isLoading}
            placeholder={state?.l.signUp.password}
          />
        </Form.Item>
        <Form.Item name="remember" style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <Switch style={{ marginRight: "8px" }} checked={remember} onChange={onChangeRemember}
              disabled={isLoading}
            />
            {state?.l.login.remember}
            <Link
              to="#"
              style={{ marginLeft: '6rem' }}
              onClick={() => setForgotPasswordVisible(true)}
            >
              {state?.l.login.forgotPassword}
            </Link>
          </div>
        </Form.Item>

        <Form.Item>
          <div>
            <Button
              type="primary"
              style={{ width: "100%" }}
              htmlType="submit"
              loading={isLoading}
            >
              {state?.l.login.signInSend}
            </Button>
            <p>
              {state?.l.login.noAccount}{' '}
              <Link to="#" onClick={() => onTabChange('signUp')}>
                {state?.l.login.signupLink}
              </Link>
            </p>
          </div>
        </Form.Item>
      </Form>
      {forgotPasswordVisible && <ForgotPassword visible={forgotPasswordVisible} setForgotPasswordVisible={setForgotPasswordVisible} />}
    </>
  );
}

export default SignIn;
