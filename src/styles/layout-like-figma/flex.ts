import { CSSProperties } from "react";

type AlignItemsType = 'topLeft' | 'topCenter' | 'topRight' | 'left' | 'center' | 'right' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';
type LayoutType = 'vertical' | 'horizontal' | 'horizontal-wrap';
type Resizing = 'fill';

export function flex(alignItems: AlignItemsType, gap: 'auto' | string | number | [string | number, string | number], layout?: LayoutType) {
  let w: Resizing, h: Resizing

  return {
    hFill() {
      h = 'fill';
      return this;
    },
    wFill() {
      w = 'fill';
      return this;
    },
    get(): CSSProperties {
      const res: CSSProperties = {
        display: 'flex',
        gap: (Array.isArray(gap)) ? gap.join(' ') : gap,
      }

      if (layout === 'vertical') {
        res.flexDirection = 'column'
      } else {
        res.flexWrap = 'wrap'
      }


      if (gap === 'auto') {

      }

      else {
        if (alignItems === 'topLeft') {
          res.alignItems = 'flex-start'
        } else if (alignItems === 'topCenter') {
          res.alignItems = 'flex-start'
          res.justifyContent = 'center'
        } else if (alignItems === 'topRight') {
          res.alignItems = 'flex-start'
          res.justifyContent = 'flex-end'
        } else if (alignItems === 'left') {
          res.alignItems = 'center'
        } else if (alignItems === 'center') {
          res.alignItems = 'center'
          res.justifyContent = 'center'
        } else if (alignItems === 'right') {
          res.alignItems = 'center'
          res.justifyContent = 'flex-end'
        } else if (alignItems === 'bottomLeft') {
          res.alignItems = 'flex-end'
        } else if (alignItems === 'bottomCenter') {
          res.justifyContent = 'center'
          res.alignItems = 'flex-end'
        } else if (alignItems === 'bottomRight') {
          res.justifyContent = 'flex-end'
          res.alignItems = 'flex-end'
        } else {
          console.error("Invalid alignItems type");
        }
      }

      if (h === 'fill') res.flex = '1 0 0'
      if (w === 'fill') {
        res.flexShrink = 0
        res.alignSelf = 'stretch'
      }
      return res
    }
  };
}


flex("bottomCenter", 'auto', 'horizontal-wrap').hFill().get()


