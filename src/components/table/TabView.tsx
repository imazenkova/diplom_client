import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { App, Button, Divider, Input, Select, Space } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { useDebugInformation } from '../../hooks/debug/useDebugInformation';
import { eqObj } from '../../hooks/eq-obj';
import useDelayedCallback from '../../hooks/useDelayedCallback';
import { ApiError } from '../../shared.lib/api/errors';
import { TypeResource } from '../../shared.lib/api/resource.api';
import { FilterRow, IFilter } from '../../shared.lib/filter-and-sort/filter';
import { SettingItem } from './TabConfig';
import { ASINColumns } from './asin-table-columns';
import { IResourceTabView, useTabResource } from './useTabResource';


export type ColumnState = Record<string, { title: string; visible: boolean }>;

interface ConfigColumnsProps {
  type: TypeResource
  columns: ASINColumns;
  fileNameLoad: string;
  checkedColumns: string[];
  activeColumns: ASINColumns;
  rulesToSave: IFilter<any>;
  onChangedColumns: (columns: ASINColumns) => void;
  setNewRules: (rules: any[]) => void;
  setCheckedColumns: (newColumns: string[]) => void;
}
const TabView: React.FC<ConfigColumnsProps> = (props) => {
  const {
    type,
    fileNameLoad,
    checkedColumns,
    activeColumns,
    rulesToSave,
    setNewRules,
    onChangedColumns,
    setCheckedColumns
  } = props
  let { columns } = props

  //---------Сохранение и использование сохраненных пользовательских настроек
  const [resourceData, setResourceData] = useState<IResourceTabView[]>([]);
  const [buttonName, setButtonName] = useState("")
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [curentSettings, setCurentSettings] = useState<ASINColumns>(columns);// чтобы сраавнивать с изменениями и убирать название представления
  const [curentRules, setCurentRules] = useState<FilterRow<any>[]>(rulesToSave);// чтобы сраавнивать с изменениями и убирать название представления
  const { state } = useContext<ContextType>(AppContext);
  const { message, modal } = App.useApp()

  const tabResource = useTabResource(state?.l!)
  const dbg = useDebugInformation('TabView', props)

  const transl = state?.l.view;

  //из ресурсов установили настройки, мы выводим название на вью
  useEffect(() => {
    setSelectedValue(fileNameLoad)
  }, [fileNameLoad]);

  // чтобы файлы с бд отображались пользователю
  const loadResourceData = async () => {
    try {
      let res = await tabResource.load(type)
      res = res.map((item: any) => {
        if (item.name.endsWith('.json')) {
          item.name = item.name.slice(0, -5); // убираем  (.json) из имени
        }
        return item;
      });
      setResourceData(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadResourceData();
  }, []);

  const saveResource = async (name: string) => {

    await tabResource.save(name, type, columns, rulesToSave, checkedColumns)
    await loadResourceData()
  }

  //применяем  найстройки с файла загруженного с бд
  const loadTableSettings = (resource: { name: string, value: any }) => {
    const parsedValue = resource.value;
    const newColumns = parsedValue.columns as SettingItem[];
    const newRulesToSave = parsedValue.rules as FilterRow<any>[];
    const mapKey = new Map<string, SettingItem>(newColumns.map(v => [v.field, v]))
    columns = columns.filter(column => mapKey.has(column.field as string))

    for (let i = 0; i < columns.length; i++) {
      const val = mapKey.get(columns[i].field as string)
      columns[i] = { ...columns[i], ...val }
    }

    if (!eqObj(columns, activeColumns)) {
      setCurentSettings(columns)
      onChangedColumns(columns);
    }
    setNewRules(newRulesToSave);
    setCurentRules(newRulesToSave);

    // // ключи из resource.value и устанавливаем их как отмеченные галочки
    const newCheckedColumns = newColumns.map((column: SettingItem) => column.field);
    setCheckedColumns(newCheckedColumns);
  };

  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  useEffect(() => {
    setButtonName(fileNameLoad);
    setSelectedValue(fileNameLoad);
    if (fileNameLoad === transl?.name) {
      setSelectedValue(null);
    }
  }, [fileNameLoad]);

  //убирать выбранное представление, если произошли изменения
  useEffect(() => {
    if (!eqObj(curentSettings, activeColumns)) {
      setSelectedValue(null);
    }
  }, [activeColumns]);

  //при изменении ширины скидывать вью
  useEffect(() => {
    const hasDifferentWidthorCount = columns.every((column, index) => {
      const curentSetting = curentSettings[index];
      return column.field === curentSetting.field && column.width === curentSetting.width;
    });
    if (!hasDifferentWidthorCount) {
      setSelectedValue(null);
    }
  }, [columns]);

  //проверкана применение новых правил , при использовании вью
  useEffect(() => {
    const hasDifferentRules = !eqObj(rulesToSave, curentRules)
    if (hasDifferentRules) {
      setSelectedValue(null);
    }
  }, [rulesToSave]);


  const chooseConfigDialog = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      modal.confirm({
        icon: null,
        content: (<>{state!.l.tabView.viewIsExist}</>),
        onOk: () => { resolve(true) },
        onCancel: () => { resolve(false); }  // если пользователь закрыл диалог без выбора
      });
    });
  }

  const onChooseView = async (value: string) => {
    const __onChooseViewEnd = dbg.__begin_perfom('onChooseView')
    const selectedItem = resourceData.find(item => item.name === value);// Находим выбранный ресурс по значению
    if (selectedItem) {
      loadTableSettings(selectedItem);//применяем  найстройки с файла загруженного с бд
      setSelectedValue(selectedItem.name);
    }
    __onChooseViewEnd()
  }

  const [onChooseViewInvoke] = useDelayedCallback<(val: string) => void>(onChooseView, 200)

  const onClick = async (e: React.MouseEvent<HTMLElement>) => {
    const fr = resourceData.filter(v => v.name === name)
    if (fr.length > 0) {
      if (!await chooseConfigDialog()) return
    }

    try {
      await saveResource(name)
      message.success(state!.l.tabView.successAdd(name))
    } catch (error) {
      const err=ApiError.From(error).getFullMessage(', ')
      message.error(state!.l.tabView.errorAdd(err))
    }
    e.preventDefault();
  }


  //-------------------------------
  //!!!!Тест влево вправо пока не удалять будет время посмотреть
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedValue) {
      const index = resourceData.findIndex(item => item.name === selectedValue);
      setCurrentIndex(index);
    }
  }, [selectedValue, resourceData]);

  const handleLeftClick = () => {
    if (currentIndex !== null && currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newValue = resourceData[newIndex]?.name;
      if (newValue) {
        onChooseViewInvoke(newValue);
      }
    }
  };

  const handleRightClick = () => {
    let cindex = currentIndex
    if (cindex === null) {
      setCurrentIndex(cindex)
      cindex = 0
    }

    if (cindex !== null && cindex < resourceData.length - 1) {
      const newIndex = cindex + 1;
      const newValue = resourceData[newIndex]?.name;
      if (newValue) {
        onChooseViewInvoke(newValue);
      }
    }
  };

  //-------------------------------

  return (
    <>
      <Button size='small' disabled={!currentIndex} type='text' style={{ marginRight: '2px' }} icon={<LeftOutlined />} onClick={handleLeftClick} />
      <Select
        showSearch
        style={{ minWidth: "7em", width: "8.5rem", maxHeight: '13rem' }}
        size='small'
        placeholder={buttonName}
        value={selectedValue}
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{ marginBottom: '7px', marginTop: '7px' }} orientationMargin={0} type='horizontal' />
            <Space size="small" direction='horizontal' style={{ padding: '0 6px 6px 0' }} >
              <Input
                style={{ marginLeft: "0.3rem" }}
                placeholder={transl?.fileName}
                ref={inputRef}
                value={name}
                size="small"
                onPressEnter={async (e) => {
                  await saveResource(name)
                  e.stopPropagation();
                }}
                onChange={onNameChange}
                maxLength={32}
              />
              <Button size='small' type='primary' icon={<PlusOutlined />}
                onClick={onClick}>
              </Button>
            </Space>
          </>
        )}
        popupMatchSelectWidth={false}
        options={resourceData.map((item) => {
          return {
            label: <>{item.name}</>,
            value: item.name
          }
        })}
        onChange={(value) => {
          setSelectedValue(value)
          onChooseViewInvoke(value)
        }}
        onClick={() => { loadResourceData() }}
      />
      <Button size='small' disabled={!!currentIndex && currentIndex === resourceData.length - 1} type='text' style={{ marginLeft: '2px' }} icon={<RightOutlined />} onClick={handleRightClick} />
    </>

  )
}
export default TabView;

