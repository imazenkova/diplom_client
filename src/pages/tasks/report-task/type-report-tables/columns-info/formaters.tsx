import { Image } from 'antd';
import { createRoot } from 'react-dom/client';
import { CellComponent, EmptyCallback, ImageParams } from "tabulator-tables";
import { themeDef } from '../../../../../styles/theme.app.def';

export function colorPrimary(cell: CellComponent, formatterParams: ImageParams, onRendered: EmptyCallback): string | HTMLElement {
  cell.getElement().style.color = themeDef.antd.colorSuccessTextActive
  return cell.getValue();
}

export function aimgeHeader(cell: CellComponent, formatterParams: any, onRendered: EmptyCallback): string | HTMLElement {
  const container = document.createElement('div');

  const root = createRoot(container);

  root.render(<>
    <Image src={formatterParams.src} height="32px" width="24px" />
  </>
  );

  return container
}


export function aimge(cell: CellComponent, formatterParams: ImageParams, onRendered: EmptyCallback): string | HTMLElement {
  const { height, width, urlPrefix = '', urlSuffix = '' } = formatterParams;
  let fieldVal = cell.getValue()
  if (!fieldVal) return ''


  // Если значение представляет собой строку, начинающуюся на [ и заканчивающуюся на ], пытаемся распарсить её как JSON
  if (typeof fieldVal === 'string' && fieldVal.startsWith('[') && fieldVal.endsWith(']')) {
    try {
      fieldVal = JSON.parse(fieldVal);
    } catch (err) { }
  }

  const imageUrls: string[] = []
  //Если массив то выводим первую картинку по умолчанию
  if (Array.isArray(fieldVal)) {
    fieldVal.forEach(v => imageUrls.push(`${urlPrefix}${v}${urlSuffix}`))
  } else {
    imageUrls.push(`${urlPrefix}${fieldVal}${urlSuffix}`)
  }

  const container = document.createElement('div');

  const root = createRoot(container);

  // const ta = <Image.PreviewGroup items={imageUrls}>
  //   <Image src={imageUrls[0]} height={height} width={width} />
  // </Image.PreviewGroup>


  root.render(
    <Image.PreviewGroup items={imageUrls}>
      <Image src={imageUrls[0]} height={height} width={width} />
    </Image.PreviewGroup>
  );

  // const prev = <Image.PreviewGroup
  //   items={[
  //     'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
  //     'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
  //     'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
  //   ]}
  // >
  //   <Image
  //     width={200}
  //     src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
  //   />
  // </Image.PreviewGroup>

  // root.render(prev)


  return container
}

export function adate(cell: CellComponent, formatterParams: ImageParams, onRendered: EmptyCallback): string | HTMLElement {
  if (!cell.getValue()) return ''
  const date = new Date(cell.getValue());
  if (date.valueOf() === 0) return ''
  const formattedDate = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  return formattedDate;
}

