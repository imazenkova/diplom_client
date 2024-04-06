import { EditOutlined, LockOutlined } from '@ant-design/icons';
import { useContext, useState } from "react";
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { AuthApi } from "../../api/auth.api.cli";
import { Button, Col, Form, Input, Row, message } from "antd";
import { ApiError } from '../../shared.lib/api/errors';

const ChangePassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useContext<ContextType>(AppContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [form] = Form.useForm();

  const handleSubmitChanges = async () => {
    try {
      setIsLoading(true);
      await AuthApi.setNewPassword({
        newPassword: newPassword,
        password: oldPassword
      });
      form.resetFields();
      message.success(state?.l.profile.succChangePassword)
    } catch (e) {
      const ae = ApiError.FromAxios(e)
      if (ae.aexCode === 'auth.ErrPassword') {
        message.error(`${state?.l.errors.ErrPassword}  ${state?.l.profile.errorOldPassword}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div>
        <Form style={{ width: "21rem" }}
          form={form}
          disabled={isLoading}
          onFinish={handleSubmitChanges}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="oldPassword"
                rules={[{ required: true, message: state?.l.profile.inputOldPassword },
                {
                  min: 8,
                  max: 32,
                  message: state?.l?.signUp.invalidPasswordLength,
                }]}
              >
                <Input.Password
                  id="oldPassword"
                  type="password"
                  prefix={<><LockOutlined style={{ color: 'gray' }} /><span> </span></>}
                  value={oldPassword}
                  placeholder={state?.l?.profile.oldPassword}
                  name="oldPassword"
                  onChange={(e) => { setOldPassword(e.target.value) }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="newPassword"
                rules={[{ required: true, message: state?.l.profile.inputNewPassword },
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
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value) }}
                  placeholder={state?.l?.profile.newPassword}

                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="center">
            <Col>
              <Button
                type="primary"
                style={{ width: "21rem" }}
                htmlType="submit"
                icon={<EditOutlined />}
              >
                {state?.l.profile.changePassword}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  )
}
export default ChangePassword;
