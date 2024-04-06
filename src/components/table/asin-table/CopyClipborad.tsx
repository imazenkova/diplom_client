import { CopyOutlined } from '@ant-design/icons';
import { App, Button } from 'antd';
import React, { useContext } from 'react';
import { Tabulator } from 'tabulator-tables';
import { AppContext } from '../../../AppContext';
import { ContextType } from '../../../Reduser';
import { ASINColumns } from '../asin-table-columns';

export interface DownloadTableProps {
  visible: {
    tsv?: boolean
  }
  dataSource: any[]
  columns: ASINColumns
  tabulator: Tabulator
}


const CopyClipboard: React.FC<DownloadTableProps> = (
  {
    visible,
    dataSource,
    columns,
    tabulator
  }) => {

  const { state } = useContext<ContextType>(AppContext);
  const { message } = App.useApp();

  const toTCSVArr = (data: any[], copyHeader: boolean): any[] => {
    const tsv: any[] = []

    let tsvRow: any[] = []
    if (copyHeader) {
      columns.forEach((v1, idx) => {
        if (v1.download !== undefined && !v1.download) return
        tsvRow.push(v1.title)
      })
      tsv.push(tsvRow)
    }

    data.forEach(dsrow => {
      tsvRow = []
      columns.forEach((v1, idx) => {
        if (v1.download !== undefined && !v1.download) return
        let v = dsrow[v1.field as string]
        if ((v1.dataType === 'boolean') && (typeof v === 'boolean')) v = v ? '1' : '0'
        if ((v1.dataType === 'number') && (typeof v === 'number')) v = v.toLocaleString(state?.local)
        if (v1.dataType === 'date') v = new Date(v).toLocaleString(state?.local)

        tsvRow.push(v)
      })
      tsv.push(tsvRow)
    })

    return tsv

  }

  const tsvCopy = async () => {

    const selRows = tabulator.getSelectedRows()
    const selectedRows = selRows.filter(f => !f.getElement().hidden).map(v => v.getData())

    let tsv: any[]

    if (selectedRows.length > 0) tsv = toTCSVArr(selectedRows, false)
    else tsv = toTCSVArr(dataSource, false)
    const tsvStr = tsv.map((v: any) => v.join('\t')).join('\n')

    try {
      await navigator.clipboard.writeText(tsvStr);
      message.success(`${state!.l.copyClipboard.succCopy}`);
    } catch (err) {
      console.error(`${state!.l.copyClipboard.errorCopy}`, err);
      message.error(`${state!.l.copyClipboard.errorCopyText}`);
    }
  }

  return (
    <>
      {visible.tsv && <Button type="text" onClick={tsvCopy} shape="round" icon={<CopyOutlined />}
        size='middle' ></Button>}
    </>
  );
};

export default CopyClipboard;
