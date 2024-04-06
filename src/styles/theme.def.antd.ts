import type { ThemeConfig } from 'antd';

const fontSizeApp = 14

export const themeDefAntd: ThemeConfig = {
  token: {
    fontSize: fontSizeApp,
    colorPrimary: "#0d68be",
    //colorBgBase: "rgba(100, 104, 190, 0.7)",
    //colorBgBase: "rgba(255, 255, 255)",

    borderRadius: 7,
    fontFamily: "Montserrat,sans-serif",
    lineHeight: 1.5,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",

    sizeStep: 3,
    sizeUnit: 3
  },
  components: {
    Table: {
      fontSize: fontSizeApp - 1,
    },
    Upload: {
      fontSize: fontSizeApp - 1,
    },
    Form: {
      fontSize: fontSizeApp - 1
    },
    Checkbox:{
      colorPrimary: "#aeaeb0",
    },
    Steps: {
      fontSize: fontSizeApp - 1
    }
  },
}
