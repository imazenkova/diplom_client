import { CSSProperties } from "react";
import { themeDef } from "../../../styles/theme.app.def";

export const headerCss: CSSProperties = {
  background: themeDef.antd.colorBgBase,
  height: themeDef.app.headerHeight,
  display: 'flex',
  padding: '0 1rem'
}

export const filterItem: CSSProperties = {
   width: '8rem',
}


export const buttonIcon: CSSProperties = {
  fontSize: '1.6rem', color: themeDef.antd.geekblue7
}
