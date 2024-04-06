import { SwapOutlined } from '@ant-design/icons';
import { App, Button, Form, Switch, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { AuthApi } from "../../api/auth.api.cli";
import { ApiAccess, ApiAccessSet } from '../../shared.lib/api/auth.api';
import { ApiError } from '../../shared.lib/api/errors';
import { colCenterCss } from '../../styles/grid.styles';

const ApiProfileInfo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useContext<ContextType>(AppContext);
  const { message } = App.useApp()

  const [email] = useState(state?.profile?.user.email);
  const [apiAccess, setApiAccess] = useState<ApiAccess>({ enabled: false, token: '' });


  useEffect(() => {
    onReadApiAccessData()
  }, [])

  const onReadApiAccessData = async () => {
    try {
      setIsLoading(true);
      const res = await AuthApi.getApiAccess();
      setApiAccess(res)
      debugger
    } catch (error: any) {
      message.error(ApiError.From(error).getFullMessage(', '))
      console.error('Error readApiAccessData', error);
    }
    finally {
      setIsLoading(false);
    }
  }


  const onRefreshApiKey = async () => {
    try {
      setIsLoading(true);
      const res = await AuthApi.refreshApiToken();
      setApiAccess(res)
      message.success(state?.l.apiProfile.successRefresh)
    } catch (error: any) {
      message.error(ApiError.From(error).getFullMessage(', '))
      console.error('Error refreshApiKey', error);
    }
    finally {
      setIsLoading(false);
    }
  }

  const onSetApiAccess = async (apiAccessSet: ApiAccessSet) => {
    try {
      setIsLoading(true);
      const res = await AuthApi.setApiAccess(apiAccessSet);
      setApiAccess(res)
    } catch (error: any) {
      debugger
      message.error(ApiError.From(error).getFullMessage(', '))
      console.error('Error setApiAccess', error);
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
          //labelCol={{ span: 5 }}
          //wrapperCol={{ span: 24 }}
          disabled={isLoading}
          layout='vertical'
          size='middle'
        >
          <div style={{ ...colCenterCss, paddingBottom: '0.8rem' }} >
            <Typography.Text type="secondary" >{email}</Typography.Text>
          </div>
          <Form.Item name="enabled"
          >
            <div>
              <Switch checkedChildren={state?.l?.apiProfile.on} unCheckedChildren={state?.l?.apiProfile.off} checked={apiAccess.enabled}
                onChange={(checked) => onSetApiAccess({ enabled: checked })}
              />
            </div>
          </Form.Item>

          <Form.Item
            label={state?.l?.apiProfile.keyName}
          >
            <Typography.Text
              ellipsis={true}
              style={{ width: '100%' }}
              disabled={!apiAccess.enabled} copyable>{apiAccess.token}</Typography.Text>
          </Form.Item>
          <Form.Item >
            <Button type='default'
              style={{ width: "100%" }}
              htmlType="submit"
              disabled={!apiAccess.enabled}
              onClick={onRefreshApiKey}
              icon={<SwapOutlined />}
            >
              {state?.l.apiProfile.updateKey}
            </Button>
          </Form.Item >
        </Form>
      </div>
    </>

  )
}
export default ApiProfileInfo;
