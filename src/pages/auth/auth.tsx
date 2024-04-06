import { Card, Col, Row, Space } from 'antd';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import Logo from '../../components/layout/Logo';
import { colCenterCss, colLeftCss } from '../../styles/grid.styles';
import { themeDef } from '../../styles/theme.app.def';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthComponent = () => {
  const { state } = useContext<ContextType>(AppContext);
  const [activeTabKey, setActiveTab] = useState<string>('signIn');

  const tabList = [
    {
      key: 'signIn',
      tab: state?.l?.login.signInTitle,
    },
    {
      key: 'signUp',
      tab: state?.l?.signUp.signUpTitle
    },
  ];

  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  const contentList: { [key: string]: React.ReactNode } = {
    signIn: <SignIn onTabChange={onTabChange} />,
    signUp: <SignUp onTabChange={onTabChange} />,
  };

  const cardTitle = (
    <Row align='middle' style={colLeftCss} >
      <Space style={{ paddingBottom: '0.8rem' }}>
        <Logo collapsed={false} />
      </Space>
    </Row>
  )

  return (
    <div style={{}}>
      <Row style={{ backgroundColor: themeDef.app.backgroundColor}}>
        <Col style={{...colCenterCss, height:'100vh'}}
          span={10}>
          <Card
            style={{ width: 'auto', minHeight: '15rem', maxHeight: '80vh' }}
            title={cardTitle}
            tabList={tabList}
            size='small'
            activeTabKey={activeTabKey}
            onTabChange={onTabChange}
          >
            {contentList[activeTabKey]}
          </Card>
        </Col>
        <Col span={14} style={{...colCenterCss, height:'100vh' }}>
          {/* Тут реклама*/}
        </Col>
      </Row>
    </div>
  );
};

export default AuthComponent;
