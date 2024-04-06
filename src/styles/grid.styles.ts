import { CSSProperties } from "react";

export const colCenterCss: CSSProperties = {
  alignItems: 'center', justifyContent: 'center', display: 'flex'
}


export const colRightCss: CSSProperties = {
  ...colCenterCss,
  justifyContent: 'flex-end'
}


export const colLeftCss: CSSProperties = {
  ...colCenterCss,
  alignItems: 'center',
  justifyContent: ''
}


export const directionHorizFlexCss: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
}

export const directionVerticalFlexCss: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}
