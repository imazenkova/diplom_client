import { SaveOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Checkbox, Col, Dropdown, Input, Row, Space } from 'antd';
import fuzzysort from 'fuzzysort';
import React, { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { InferType } from 'yup';
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { TypeResource } from '../../shared.lib/api/resource.api';
import { IFilter } from '../../shared.lib/filter-and-sort/filter';
import { colLeftCss, colRightCss } from '../../styles/grid.styles';
import TabResource from './TabResource';
import TabView from './TabView';
import { ASINColumns } from './asin-table-columns';

export const settingItem = Yup.object({
  field: Yup.string().required(),
  width: Yup.number().required().positive().integer(),
});

export type SettingItem = InferType<typeof settingItem>;

export type ColumnState = Record<string, { title: string; visible: boolean }>;

export const filterOptions = (options: any, searchText: string) => {

  if (!searchText) {
    return options;
  }
  const lowercasedSearchText = searchText.toLowerCase();
  return options.filter((option: any) =>
    option.label.toLowerCase().includes(lowercasedSearchText)
  );
};

interface ConfigColumnsProps {
  type: TypeResource;
  columns: ASINColumns;
  activeColumns: ASINColumns;
  filterRules: IFilter<any>,
  onChangedColumns: (columns: ASINColumns) => void;
  onChangedRules: (filter: IFilter<any>) => void
}
const TabConfig: React.FC<ConfigColumnsProps> = (props) => {
  const { type, columns, activeColumns, onChangedRules, filterRules, onChangedColumns } = props

  //-------Выбор пользователем набора столбцов.Какие будут отображаться,какие нет
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [checkedColumns, setCheckedColumns] = useState<string[]>(columns.map((column: any) => column.field));
  const { state } = useContext<ContextType>(AppContext);
  const transl = state?.l.configColumns;
  const [visibleModal, setVisibleModal] = useState(false);
  const [fileNameLoad, setFileNameLoad] = useState<string>(state!.l.view.name);

  // При изменении ширины устанавливать в кнопку дефолтное значение
  const columnWidths = columns.map((column: any) => column.width);
  const [prevColumnWidths, setPrevColumnWidths] = useState<number[]>(columnWidths);

  const areArraysEqual = (a: any[], b: any[]): boolean => {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  };

  useEffect(() => {
    // Проверяем, изменились ли ширины колонок
    if (!areArraysEqual(prevColumnWidths, columnWidths)) {
      // Устанавливаем значение setFileNameLoad в соответствии с вашими требованиями
      setFileNameLoad(state!.l.view.name);
      // Обновляем предыдущие ширины колонок
      setPrevColumnWidths(columnWidths);
    }
  }, [columnWidths]);

  const handleShowAllColumns = () => {
    setHiddenColumns([]);
    setCheckedColumns(columns.map((column: any) => column.field));
    setFileNameLoad(state?.l.view!.name!);
  };

  const handleHideAllColumns = () => {
    setHiddenColumns(columns.map((column: any) => column.field));
    setCheckedColumns([]); // сбрасываем все галочки
    setFileNameLoad(state?.l.view!.name!);
  };

  useEffect(() => {
    const newColumns = columns.filter((column: any) => !hiddenColumns.includes(column.field));
    onChangedColumns(newColumns);
  }, [hiddenColumns]);

  const handleOpenModal = () => {
    setVisibleModal(true);
  };

  const handleCloseModal = () => {
    setVisibleModal(false);
  };

  const search = () => {
    const mitem = ((column: any) => {
      const v = {
        label: column.title,
        value: column.field
      }
      if (column.titleFormatter === 'rowSelection') v.label = '✓'
      return v
    })

    if (!searchText) return columns.map(v => mitem(v))
    const fsort = fuzzysort.go(searchText, columns, { key: 'title' })
      .map((v: any) => v.obj)
      .map((v: any) => mitem(v))

    return fsort
  }

  const [checkTimer, setCheckTimer] = useState<number | undefined>(undefined);
  const handleColumnsChange = (checkedValues: any) => {
    setCheckedColumns(checkedValues);
    if (checkTimer !== undefined) window.clearTimeout(checkTimer); // Очистите текущий таймер
    const localCheckTimer = window.setTimeout(() => {
      // Запустите новый таймер
      const newHiddenColumns = columns
        .filter((column: any) => !checkedValues.includes(column.field))//выбираем те колонки,которых нет в выбранных
        .map((column: any) => column.field);
      setHiddenColumns(newHiddenColumns);
      setFileNameLoad(state?.l.view!.name!);
    }, 500); // Время задержки 500 мс
    setCheckTimer(localCheckTimer);
  };

  const items: MenuProps['items'] = [
    {
      key: '1', label: <Input
        suffix={<SearchOutlined />}
        size='small'
        onChange={(e) => setSearchText(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
    },
    {
      key: '2', label:
        <Row onClick={(e) => e.stopPropagation()} >
          <Col span={12} style={colLeftCss}>
            <Button type="text" onClick={handleShowAllColumns}>
              {transl?.showAll}
            </Button>
          </Col>
          <Col span={12} style={colRightCss}>
            <Button type="text" onClick={handleHideAllColumns}>
              {transl?.hideAll}
            </Button>
          </Col>
        </Row >
    },
    {
      key: '3', label:
        <div onClick={(e) => e.stopPropagation()} style={{ overflowY: 'auto', maxHeight: '13rem' }}>
          <Checkbox.Group
            style={{ width: '100%', flexDirection: 'column' }}
            value={checkedColumns}
            options={
              search()
            }
            onChange={handleColumnsChange}
          />
        </div>
    },
    {
      key: '4', label:
        <div style={{ display: 'flex', justifyContent: 'center', width: "18rem" }}>
          <Button onClick={handleOpenModal} icon={<SaveOutlined />}>
            {transl?.saveUploadView}
          </Button>
        </div>
    },

  ];

  return (
    <>
      <Space direction='horizontal'>
        <Dropdown
          menu={{
            items
          }}
          trigger={['click']}
          arrow={{ pointAtCenter: true }}
        >
          <Button type="text" shape="round"
            icon={<SettingOutlined />}
          >
          </Button>
        </Dropdown>

        <TabView
          type={type}
          columns={columns}
          checkedColumns={checkedColumns}
          fileNameLoad={fileNameLoad}
          activeColumns={activeColumns}
          rulesToSave={filterRules}
          setNewRules={onChangedRules}
          setCheckedColumns={setCheckedColumns}
          onChangedColumns={onChangedColumns}
        />
      </Space>

      <TabResource
        type={type}
        columns={columns}
        checkedColumns={checkedColumns}
        visibleModal={visibleModal}
        rulesToSave={filterRules}
        setFileNameLoad={setFileNameLoad}
        setCheckedColumns={setCheckedColumns}
        handleCloseModal={handleCloseModal}
        onChangedRules={onChangedRules}
        onChangedColumns={onChangedColumns}
      />
    </>
  )

};

export default TabConfig;

