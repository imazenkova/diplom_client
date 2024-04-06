import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, App } from "antd";
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from '../../AppContext';
import { ContextType, State } from '../../Reduser';
import { AuthApi } from '../../api/auth.api.cli';
import { ApiError } from '../../shared.lib/api/errors';
import { TypeLang } from '../../shared.lib/locale.lang';
import { VerifyCode } from './VerifyCode';
import { AppSettig } from '../../app.setting';
interface SignUpProps {
  onTabChange: (tab: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onTabChange }) => {
  const { Option } = Select;

  const { message } = App.useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [lang, setLang] = useState<TypeLang>('en');
  const [visibleCode, setVisibleCode] = React.useState(false);
  const [codeToken, setCodeToken] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { state, dispatch } = useContext<ContextType>(AppContext);

  const handleCodeCancel = () => {
    setVisibleCode(false);
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const result = await AuthApi.signUp({
        firstName,
        lastName,
        email,
        lang: lang as TypeLang,
        password,
        role: 'user',
      });
      setCodeToken(result.token)
      setVisibleCode(true);
    } catch (e) {
      const ae = ApiError.FromAxios(e);
      if (ae.aexCode === 'auth.emailExist') {
        message.error(`${state?.l.errors.emailExist}`);
      } else {
        message.error(ae.getMessages().map(e => <>{e}<br /></>))
      }
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleCodeSuccess = async () => {
    try {
      setIsLoading(true);
      setVisibleCode(false);
      const result = await AuthApi.login({
        email: email,
        password: password,
      });
      message.success(state?.l?.auth.signUpSuccessMessage);
      if (dispatch) {
        dispatch({type: State.BEARER_TOKEN, payload: result.token, maxAge: AppSettig.maxAgeAuth});
        dispatch({ type: State.PROFILE, payload: result });
      }
      navigate('/');
    } catch (e) {
      const ae = ApiError.FromAxios(e);
      if (ae.aexCode === 'auth.emailExist') {
        message.error(`${state?.l.errors.emailExist}`);
      } else {
        message.error(ae.getMessages().map(e => <>{e}<br /></>))
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form
        style={{ width: "23rem" }}
        initialValues={{ remember: true }}
        onFinish={handleSignUp}
      >
        {/* <h2>
          {state?.l?.signUp.inputData}
        </h2> */}

        <Form.Item
          name="firstName"
          rules={[{ required: true, message: state?.l.signUp.inputFirstName },
          {
            pattern: /^[a-zA-Zа-яА-Я]+$/,
            message: state?.l?.signUp.invalidFirstName,
          },]}
        >
          <Input
            value={firstName}
            maxLength={32}
            onChange={(e) => { setFirstName(e.target.value) }}
            placeholder={state?.l.signUp.firstName}
            disabled={isLoading}
          />
        </Form.Item>
        <Form.Item
          name="lastName"
          rules={[
            { required: true, message: state?.l?.signUp.inputLastName },
            {
              pattern: /^[a-zA-Zа-яА-Я]+$/,
              message: state?.l?.signUp.invalidLastName,
            },
          ]}
        >
          <Input
            value={lastName}
            maxLength={32}
            prefix={<><UserOutlined style={{ color: 'gray' }} /><span> </span></>}
            onChange={(e) => { setLastName(e.target.value) }}
            placeholder={state?.l.signUp.lastName}
            disabled={isLoading}
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: state?.l.signUp.inputEmail }]}
        >
          <Input
            type="email"
            prefix={<><MailOutlined style={{ color: 'gray' }} /><span> </span></>}
            maxLength={32}
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            placeholder={state?.l.signUp.email}
            disabled={isLoading}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: state?.l.signUp.inputPassword },
          {
            min: 8,
            max: 32,
            message: state?.l?.signUp.invalidPasswordLength,
          }]}
        >
          <Input.Password
            prefix={<><LockOutlined style={{ color: 'gray' }} /><span> </span></>}
            type="password"
            maxLength={32}
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
            disabled={isLoading}
            placeholder={state?.l.signUp.password}
          />
        </Form.Item>
        <Form.Item >
          <Select placeholder={state?.l.signUp.chooseLang}
            value={lang}
            onChange={(value) => setLang(value)} >
            <Option value="ru">Русский</Option>
            <Option value="en">English</Option>
            <Option value="ua">Українська</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            style={{ width: "100%" }}
          >
            {state?.l?.signUp.signUpSend}
          </Button>
          <p >
            {state?.l?.signUp.haveAccount}{' '}
            <Link to={'#'} onClick={() => onTabChange('signIn')}>
              {state?.l?.login.signInSend}
            </Link>
          </p>
        </Form.Item>
      </Form>
      {/* Verify Code Modal */}
      <VerifyCode
        visible={visibleCode}
        codeToken={codeToken}
        onCancel={handleCodeCancel}
        onSuccess={handleCodeSuccess}
      />
    </>
  );
}

export default SignUp;

