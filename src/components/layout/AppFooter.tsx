import { Divider, Space } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import React, { CSSProperties } from 'react';
import { CSSU, themeDef } from '../../styles/theme.app.def';
import { useHeaderFooterContext } from './HeaderFooterContext';
import { AppSettig } from '../../app.setting';

export const footerCss: CSSProperties = {
  background: themeDef.antd.colorBgBase,
  padding: `0 ${themeDef.app.headerFuterPaddingLRHeight} 0 ${themeDef.app.headerFuterPaddingLRHeight}`,
  height: CSSU.calc(themeDef.app.headerHeight, v => v * 0.6),
  display: 'flex',
}

export const footerSpaceCss: CSSProperties = { fontSize: '0.8rem', color: 'gray' }

const AppFooter: React.FC = () => {
  const { footerMenu } = useHeaderFooterContext();
  return <>
    <Footer style={footerCss}>
      <Space align='center' style={{ ...footerSpaceCss, justifyContent: 'flex-start', width: '25%' }} >© 2024 Market Spy | {AppSettig.getVersion()}</Space>
      <Space align='center' style={{ ...footerSpaceCss, justifyContent: 'flex-end', width: '75%' }} >
        {footerMenu.map((v, i) => <div key={i}>
            <span key={v.key}>{v.val}</span>
            {i !== footerMenu.length - 1 && <Divider type='vertical' orientation='center' />}
          </div>)}
      </Space>

    </Footer>
  </>
}

export default AppFooter;


