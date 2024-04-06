import { CSSProperties } from "react";
import { themeDef } from "./theme.app.def";

export const mainContentBorder: CSSProperties = {
  backgroundColor: themeDef.app.backgroundColor,
  boxShadow: themeDef.antd.boxShadowSecondary,
  borderRadius: themeDef.antd.borderRadius
}
