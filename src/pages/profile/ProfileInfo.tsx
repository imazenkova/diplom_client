import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, App, Typography } from "antd";
import { useContext, useState } from "react";
import { AppContext } from '../../AppContext';
import { ContextType, State } from '../../Reduser';
import { AuthApi } from "../../api/auth.api.cli";
import { TypeLang } from "../../shared.lib/locale.lang";
import ChangePassword from "./ChangePassword";
import { colCenterCss } from '../../styles/grid.styles';
import { Divider } from 'antd/lib';
const { Option } = Select;

const ProfileInfo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useContext<ContextType>(AppContext);

  const { message } = App.useApp()

  const [firstName, setFirstName] = useState(state?.profile?.user.firstName || '');
  const [lastName, setLastName] = useState(state?.profile?.user.lastName || '');
  const [lang, setLang] = useState(state?.profile?.user.lang);
  const [email] = useState(state?.profile?.user.email);

  const handleSubmitChanges = async () => {
    try {
      setIsLoading(true);
      const updatedData = {
        firstName: firstName,
        lastName: lastName,
        lang: lang as TypeLang
      };
      const newProfile = await AuthApi.changeProfile(updatedData);
      dispatch!({ type: State.PROFILE, payload: newProfile });
      message.success(state?.l.profile.succChange)
    } catch (error) {
      message.error(state?.l.profile.errorChange)
      console.error('Error updating profile', error);
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div style={{}}>
        <Form
          style={{ width: "21rem" }}
          onFinish={handleSubmitChanges}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 24 }}
          disabled={isLoading}
          layout="horizontal"
          size='middle'
        >
          <div style={{ ...colCenterCss, paddingBottom: '0.8rem' }} >
            <Typography.Text type="secondary" >{email}</Typography.Text>
          </div>
          <Form.Item
            name="lastName"
            label={state?.l?.signUp.lastName}
            rules={[
              {
                pattern: /^[a-zA-Zа-яА-Я]+$/,
                message: state?.l?.signUp.invalidLastName,
              },
            ]}
          >
            <Input
              value={lastName}
              maxLength={32}
              onChange={(e) => { setLastName(e.target.value) }}
              defaultValue={state?.profile?.user.lastName!}
            />
          </Form.Item>
          <Form.Item
            name="firstName"
            label={state?.l?.signUp.firstName}
            rules={[
              {
                pattern: /^[a-zA-Zа-яА-Я]+$/,
                message: state?.l?.signUp.invalidFirstName,
              },]}
          >
            <Input
              value={firstName}
              maxLength={32}
              onChange={(e) => { setFirstName(e.target.value) }}
              defaultValue={state?.profile?.user.firstName!}
            />
          </Form.Item>
          <Form.Item
            label={state?.l?.profile.lang}
          >
            <Select placeholder={state?.l.signUp.chooseLang}
              value={lang}
              onChange={(value) => setLang(value)} >
              <Option value="ru">Русский</Option>
              <Option value="en">English</Option>
              <Option value="ua">Українська</Option>
            </Select>
          </Form.Item>
          <Form.Item >
            <Button type="primary"
              style={{ width: "100%" }}
              htmlType="submit"
              icon={<UserOutlined />}
            >
              {state?.l.profile.change}
            </Button>
          </Form.Item >
        </Form>
        <Divider />
        <ChangePassword />
      </div>
    </>
  )
}
export default ProfileInfo;
