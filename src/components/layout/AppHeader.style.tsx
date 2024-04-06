import { CSSProperties } from "react";
import { CSSU, themeDef } from "../../styles/theme.app.def";

export const headerCss: CSSProperties = {
  background: themeDef.antd.colorBgBase,
  paddingLeft: themeDef.app.headerFuterPaddingLRHeight,
  paddingRight: themeDef.app.headerFuterPaddingLRHeight,
  height: themeDef.app.headerHeight,
}

export const rowMarkCss: CSSProperties = {
  height: themeDef.app.headerHeight,
  lineHeight: themeDef.app.headerHeight,
}

export const headerBtn: CSSProperties = {
  width: CSSU.calc(themeDef.app.headerHeight, v => v * 0.8),
  height: CSSU.calc(themeDef.app.headerHeight, v => v * 0.8),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}


export const buttonLeftIcon: CSSProperties = {
  fontSize: '1.1rem',
  color: themeDef.antd.geekblue7,
  fill:  themeDef.antd.colorPrimaryTextActive,
  width: '1.1rem',
  height: '1.1rem'
}

export const buttonRightIcon: CSSProperties = {
  fontSize: '1.6rem',
  color: themeDef.antd.colorTextSecondary
}
