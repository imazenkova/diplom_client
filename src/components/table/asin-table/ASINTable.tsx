import { DeleteOutlined, DownloadOutlined, SaveOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Col, Divider, Dropdown, Row, Space } from 'antd';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnComponent, ColumnDefinition, RowComponent } from 'tabulator-tables';
import { AppContext } from '../../../AppContext';
import { ContextType } from '../../../Reduser';
import { useDebugInformation } from '../../../hooks/debug/useDebugInformation';
import { useFooterMenu } from '../../../hooks/useMenu';
import useWindowSize from '../../../hooks/useWindowSize';
import { TypeResource } from '../../../shared.lib/api/resource.api';
import { Filter, IFilter } from '../../../shared.lib/filter-and-sort/filter';
import { mainContentBorder } from '../../../styles/app.styles';
import FullscreenButton from '../../layout/FullScreen';
import FilterDrop from '../FilterDrop';
import TabConfig from '../TabConfig';
import { ASINColumns } from '../asin-table-columns';
import { ASINTableOptions, ASIN_TABLE_DEFAULT_OPTIONS } from '../asin-table-options';
import TabulatorNative from '../tabulator-tables/TabulatorNative';
import CopyClipboard from './CopyClipborad';
import SearchInput, { SearchInputRef } from './SearchInput';

export interface TableSourceData {
  name: string
  dataSource: any[]
}

export interface TableSource extends TableSourceData {
  columns: ASINColumns
}

export interface ChildSource {
  childField: string
  columns: ASINColumns
}

export interface ASINTableProps {
  resource: TypeResource
  options?: ASINTableOptions
  baseTable: TableSource
  childTable?: ChildSource
  onChangeDataSource: (dataSource: any[]) => void
  onSave?: (dataSource: any[]) => Promise<void>
  //Дополнительные кнопку в хедар
  addButtonsComponent?: React.ReactNode;
  //Если используется как главная таблица в контейнере то используется стиль mainContentBorder
  useMain?: boolean
}

const ASINTable: React.FC<ASINTableProps> = (props) => {
  const { state } = useContext<ContextType>(AppContext);
  const dbg = useDebugInformation('ASINTable', props)
  const __bodyEnd = dbg.__begin_perfom('body')

  const tabulatorRef = useRef<TabulatorNative>(null);
  const tabulatorContainerRef = useRef<HTMLDivElement>(null);
  const tableAllContainerRef = useRef<HTMLDivElement>(null);
  //Если таблица пустая
  if (!props.baseTable.dataSource) props.baseTable.dataSource = []

  const { resource, options, baseTable, addButtonsComponent, onChangeDataSource, onSave } = props
  const dataSource = useRef(baseTable.dataSource)

  const [activeColumns, setActiveColumns] = useState<ASINColumns>(baseTable.columns);//используем в отрисовке

  //Есть ли изменения в таблице
  const [changed, setChanged] = useState<boolean>(false);
  const [processSaveChanges, setProcessSaveChanges] = useState<boolean>(false);

  //------------------Таблица
  //Данные которые выделены в таблице
  let [rowSelection, setRowSelection] = useState<RowComponent[]>([]);

  //Цепочка фильтрованных данных. Вначале иут данные от tabConfigfilteredData они идут первые
  const searchInputRef = useRef<SearchInputRef | null>(null);
  const [searchedValue, setSearchedValue] = useState('');
  //Устрановленные правила
  const [filterRules, setFilterRules] = useState<IFilter<any>>([]);

  const filteredData = useMemo(() => {
    let res = dataSource.current


    if (!FilterDrop.isEmptyFilter(filterRules)) {
      const __filter = dbg.__begin_perfom('filter')
      try {
        const filter = new Filter(filterRules)
        res = filter.applyFilter(res)
      } catch (error) {
        console.error('Error filter', error)
      }
      __filter()
    }

    if (!SearchInput.isEmpty(searchedValue)) {
      res = SearchInput.applyFilter(searchedValue, res, activeColumns);
    }
    // tabulatorRef.current?.tabulator?.searchRows('ID', 'in', ['1','2','3']).forEach(row=>{
    //   row.select()
    // })
    //console.log('rowSelection', rowSelection.length)

    return res;
  }, [searchedValue, filterRules]);

  const setoptions: ASINTableOptions = { ...ASIN_TABLE_DEFAULT_OPTIONS, ...options }

  const { heightWin } = useWindowSize()
  const [heightCalc, setHeightCalc] = useState(0)

  const funHeightCalc = () => {
    if (tableAllContainerRef.current && tabulatorContainerRef.current) {
      try {
        const tableAllRect = tableAllContainerRef.current.getBoundingClientRect();
        const tabulatorRect = tabulatorContainerRef.current.getBoundingClientRect();

        const diffHeight = tableAllRect.bottom - tabulatorRect.top;
        return diffHeight
      }
      catch (error) {
        return 0
      }
    } else return 0
  }

  useEffect(() => {
    const diffHeight = funHeightCalc()
    setHeightCalc(diffHeight)
  }, [tableAllContainerRef, tabulatorContainerRef, heightWin]);


  const dnldCol = (handler: () => void) => {
    handler()
  }

  const itemsDownloads: MenuProps['items'] = [
    { key: '1', label: 'CSV', onClick: () => dnldCol(() => tabulatorRef?.current?.tabulator?.download("csv", "data.csv")) },
    { key: '2', label: 'TSV', onClick: () => dnldCol(() => tabulatorRef?.current?.tabulator?.download("csv", "data.csv", { delimiter: '\t' })) },
    { key: '3', label: 'XLSX', onClick: () => dnldCol(() => tabulatorRef?.current?.tabulator?.download("xlsx", "data.xlsx", { sheetName: "My Data" })) },
    { key: '4', label: 'JSON', onClick: () => dnldCol(() => tabulatorRef?.current?.tabulator?.download("json", "data.json")) },
    { key: '5', label: 'HTML', onClick: () => dnldCol(() => tabulatorRef?.current?.tabulator?.download("html", "data.html", { style: true })) },
  ];

  const handleColumnResized = (column: ColumnComponent) => {
    //column.hide()
    // setActiveColumns( prevColumns => prevColumns.map(col => {
    //   //column.hide()
    //   if (col.field === column.getField()) {
    //     return { ...col, width: column.getWidth() };
    //   }
    //   return col;
    // }));
  };

  // FUTTER
  const bc = <span>{state!.l.asinTable.name} <b>{baseTable.name}</b></span>
  //Добавили кнопку в футер меню
  const updateMenu = useFooterMenu({ items: [{ key: 'ASTAB_NAME', val: bc }, { key: 'ASTAB_COL', val: '' }] })

  const dataTabulatorChanged = (rowCount: number) => {
    updateMenu([{ key: 'ASTAB_COL', val: <>{state!.l.asinTable.row}  <b>{rowCount}</b></> }])
  }

  useEffect(() => {
    dataTabulatorChanged(filteredData.length)
  }, [filteredData])

  //Найти у удалить строки
  const saveChanges = async () => {
    if (onSave) {
      try {
        setProcessSaveChanges(true)
        Promise.all([
          onSave(dataSource.current),
          tabulatorRef.current!.tabulator!.setData(dataSource.current)
        ])
      } finally {
        setProcessSaveChanges(false)
      }
    }
    setChanged(false)
  }

  //Найти у удалить строки
  const deleteRows = () => {
    const __deleteRowsEnd = dbg.__begin_perfom('deleteRows')

    //Тут мы реально изменяем основной datasource чтобы при следующим обновлении
    const indexesSet = new Set(rowSelection.map(v => {
      v.getElement().hidden = true
      //v.deselect()
      return v.getData().id
    }));

    const newArr = dataSource.current.filter((v => !indexesSet.has(v.id)))
    if (!changed) setChanged(true)

    __deleteRowsEnd()


    dataSource.current = newArr
    onChangeDataSource(newArr)
    const tabulator = tabulatorRef.current?.tabulator!
    //tabulatorRef.current?.tabulator?.deselectRow()
    dataTabulatorChanged(filteredData.length - tabulator.getSelectedRows().length)
  }
  __bodyEnd()

  //Чистим колонки для табулятора без dataType
  const tabulatorCols = useMemo(() => activeColumns.map(({ dataType, ...rest }) => rest) as ColumnDefinition[], [activeColumns])

  const getMainStyle = () => (props.useMain === undefined) ? mainContentBorder : (props.useMain) ? mainContentBorder : {}

  return (
    <>
      <Space ref={tableAllContainerRef} direction='vertical' size={0}
        style={{
          height: '100%', width: 'calc(100%)',
          ...getMainStyle()
        }} >
        <Row justify="space-between" align={'middle'} style={{ height: '2.3rem' }}>
          <Col>
            <Space align='center'>
              {
                onSave &&
                <Button type='text' shape='round'
                  disabled={rowSelection.length === 0}
                  onClick={deleteRows}
                  icon={<DeleteOutlined />}
                >
                </Button>
              }
              {
                onSave &&
                <Button type='text' shape='round'
                  disabled={!changed}
                  loading={processSaveChanges}
                  onClick={saveChanges}
                  icon={processSaveChanges ? '  ' : <SaveOutlined />}
                >
                </Button>
              }
              <TabConfig
                type={resource}
                columns={baseTable.columns}
                activeColumns={activeColumns}
                onChangedRules={setFilterRules}
                filterRules={filterRules}
                onChangedColumns={(newColumns: ASINColumns) => {
                  setActiveColumns(newColumns)
                }}
              />
              <Divider type="vertical" />
              <FilterDrop
                columns={activeColumns}
                newRules={filterRules}
                onRulesChange={(rules) => {
                  setFilterRules(rules)
                }}
              />
              <SearchInput ref={searchInputRef} onValueChanged={setSearchedValue}
                style={{
                  width: '15rem',
                }}
              />

              <Divider type="vertical" />
              <CopyClipboard columns={activeColumns} dataSource={dataSource.current}
                visible={{ tsv: true }} tabulator={tabulatorRef.current?.tabulator!} />

              <Dropdown
                menu={{ items: itemsDownloads, selectable: true, defaultSelectedKeys: ['1'] }}
              >
                <Button type='text' shape='round' icon={<DownloadOutlined />}>
                </Button>
              </Dropdown>

              {/*Это дропдаун для загрузки данных.... Пока нем не нужно
               <Dropdown
                menu={{ items: itemsUploads, selectable: true, defaultSelectedKeys: ['1'], }}
              >
                <Button type='text' shape='round'>
                  <Space>
                    <UploadOutlined />
                  </Space>
                </Button>
              </Dropdown> */}
              {addButtonsComponent && <Divider type="vertical" />}
              {addButtonsComponent}
            </Space>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FullscreenButton elem={tableAllContainerRef.current} shape="round" type='text' />
          </Col>
        </Row>
        {/* <Row>
          <Segmented style={{paddingLeft:'0.5rem', backgroundColor: themeDef.app.backgroundColor }} size="small" options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} />
        </Row> */}
        <div ref={tabulatorContainerRef}>
          {heightCalc && <TabulatorNative
            ref={tabulatorRef}
            options={{
              ...setoptions,
              //selectable: true,
              data: filteredData,
              selectableRangeMode: 'click',
              //layout: 'fitDataTable',
              //selectableRollingSelection: true,
              columns: tabulatorCols,
              height: heightCalc,
              //groupBy:["amz_brand", "amz_model"],
            }}
            events={{
              rowSelectionChanged: (_, selectedRows) => {
                rowSelection = selectedRows
                setRowSelection(selectedRows)
              },
              columnResized: handleColumnResized,
              columnMoved: (column, columns) => {
              },

              cellEdited: (_) => {
                if (!changed) setChanged(true)
              },
            }}
          />}
        </div>
      </Space>
    </>
  );
};

export default ASINTable;
