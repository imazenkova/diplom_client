import { UserOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, MenuProps, Modal, Row } from 'antd';
import { Header } from 'antd/es/layout/layout';
import React, { RefObject, useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { ContextType, State } from '../../Reduser';
import { AppSettig } from '../../app.setting';
import ProfileInfo from '../../pages/profile/ProfileInfo';
import { colLeftCss, colRightCss } from '../../styles/grid.styles';
import { CSSU, themeDef } from '../../styles/theme.app.def';
import { buttonRightIcon, headerBtn, headerCss, rowMarkCss } from './AppHeader.style';
import EventsDropdown from './EventsDropdown';
import FullscreenButton from './FullScreen';
import { useHeaderFooterContext } from './HeaderFooterContext';
import ApiProfileInfo from '../../pages/profile/ApiProfileInfo';

const AppHeader: React.FC = () => {
  const { state, dispatch } = useContext<ContextType>(AppContext)
  const headerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()
  const { headerMenu } = useHeaderFooterContext();
  const [openProfile, setOpenProfile] = useState(false)
  const [openApiProfile, setOpenApiProfile] = useState(false)

  const profileMenu: MenuProps['items'] = [
    {
      label: <a onClick={() => setOpenProfile(!openProfile)}
      >{state?.l.sider.profile}</a>,
      key: '0',
    },
    {
      label: <a onClick={() => setOpenApiProfile(!openApiProfile)}
      >{state?.l.sider.apiProfile}</a>,
      key: '1',
    },
    {
      label: <a onClick={() => {
        dispatch!({ type: State.LOGOUT })
        navigate(AppSettig.routePath.auth)
      }}>{state?.l.profile.logout}</a>,
      key: '2',
    }
  ]
  interface CustomModalTitleProps {
    title: React.ReactNode;
  }
  const CustomModalTitle: React.FC<CustomModalTitleProps> = ({ title }) => (
    <div style={{ textAlign: 'center' }}>{title}</div>
  );

  return (
    <Header ref={headerRef} style={headerCss}>
      <Row style={rowMarkCss}>
        <Col span={17} style={{ ...colLeftCss }}>
          {headerMenu.map(v => <div key={v.key}>{v.val}</div>)}
        </Col>
        <Col span={7} style={{ ...colRightCss, gap: CSSU.calc(themeDef.antd.sizeUnit, (v) => v * 2) }}>
          <FullscreenButton elem={document.documentElement as HTMLDivElement} type='text' buttonStyle={headerBtn} buttonIcon={buttonRightIcon} />
          <EventsDropdown />
          <Dropdown menu={{ items: profileMenu }} placement="bottomRight" trigger={['click']} arrow={{ pointAtCenter: true }}>
            <Button type='text' style={headerBtn}>
              <UserOutlined style={buttonRightIcon} />
            </Button>
          </Dropdown>
        </Col>
      </Row>

      <Modal
        title={<CustomModalTitle title={state?.l.profile.title} />}
        open={openProfile}
        centered
        width="23rem"
        onCancel={() => setOpenProfile(false)}
        footer={[
          <Button key="close" onClick={() => setOpenProfile(false)}>
           {state?.l.common.close}
          </Button>
        ]}
      >
        <ProfileInfo />
      </Modal>

      <Modal
        title={<CustomModalTitle title={state?.l.apiProfile.title} />}
        open={openApiProfile}
        centered
        width="23rem"
        onCancel={() => setOpenApiProfile(false)}
        footer={[
          <Button key="close" onClick={() => setOpenApiProfile(false)}>
         {state?.l.common.close}
          </Button>
        ]}
      >
        <ApiProfileInfo />
      </Modal>

    </Header>
  );
};

export default AppHeader;
