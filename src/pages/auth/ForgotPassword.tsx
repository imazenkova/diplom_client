import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, message } from 'antd';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { AuthApi } from '../../api/auth.api.cli';
import { ApiError } from '../../shared.lib/api/errors';

interface ForgotPassProps {
  visible: boolean;
  setForgotPasswordVisible: (value: boolean) => void;
}

const ForgotPassword: React.FC<ForgotPassProps> = ({ visible,setForgotPasswordVisible }) => {
  const { state } = useContext<ContextType>(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const hideModal = () => {
    setForgotPasswordVisible(false);
  };

  const handleSubmit = async () => {
      try {
        setIsLoading(true);
        await AuthApi.forgotPassword({ email: email });
        localStorage.setItem('email',email);
        message.success(state?.l?.profile.succChangePassword);
        hideModal();
        window.location.reload();
      } catch (e) {
        const ae = ApiError.FromAxios(e);
        if (ae.aexCode === 'auth.UserNotExist') {
          message.error(`${state?.l?.errors.UserNotExist}`);
        }
      } finally {
        setIsLoading(false);
      }
    }

  return (
    <Modal
      title={state?.l?.login.forgotPasswordTitle}
      visible={visible}
      onCancel={hideModal}
      footer={null}
      width="24.8rem"
    >
      <p>{state?.l?.signUp.inputData}</p>

      <Form
        name="normal_login"
        style={{ width: "23rem" }}
        initialValues={{ remember: true }}
         onFinish={handleSubmit}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: state?.l.signUp.inputEmail }]}
        >
          <Input
            type="email"
            prefix={<><UserOutlined style={{color: 'gray'}} /><span> </span></>}
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            placeholder={state?.l.signUp.email}
            disabled={isLoading}
          />
        </Form.Item>
        <Button
          style={{ width: '100%'}}
          type="primary"
          loading={isLoading}
          htmlType="submit"
          disabled={isLoading}
        >
          {state?.l?.login.sendEmail}
        </Button>

      </Form>
    </Modal >
  );
};

export default ForgotPassword;
