import { DownloadOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Modal, Row, Space, Typography, Upload, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { InferType } from 'yup';
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { ResourceApi } from '../../api/resource.api.cli';
import { FileSaverLocal } from '../../lib/file-saver-local';
import { TypeResource } from '../../shared.lib/api/resource.api';
import { FilterRow, IFilter } from '../../shared.lib/filter-and-sort/filter';
import { colRightCss } from '../../styles/grid.styles';
import { ASINColumns } from './asin-table-columns';
import { IResourceTabView, useTabResource } from './useTabResource';
import { eqObj } from '../../hooks/eq-obj';
const { Text } = Typography;

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

interface ModalColumnsProps {
  type: TypeResource
  columns: ASINColumns;
  checkedColumns: string[];
  visibleModal: boolean;
  rulesToSave: IFilter<any>;
  setFileNameLoad: (name: string) => void;
  setCheckedColumns: (newColumns: string[]) => void;
  handleCloseModal: (state: boolean) => void;
  onChangedRules: (rules: any[]) => void;
  onChangedColumns: (columns: ASINColumns) => void;
}

const TabResource: React.FC<ModalColumnsProps> = ({
  type,
  columns,
  checkedColumns,
  visibleModal,
  rulesToSave,
  onChangedRules,
  setFileNameLoad,
  setCheckedColumns,
  handleCloseModal,
  onChangedColumns
}) => {
  const { state } = useContext<ContextType>(AppContext);
  const transl = state?.l.resource

  const tabResource = useTabResource(state?.l!)

  const validationSchemaFileName = Yup.object({
    fileName: Yup.string()
      .required(transl!.required)
  });

  //если филтр поменялся , то убирать вывод вью
  useEffect(() => {
    const hasDifferentRules = !eqObj(rulesToSave, curentRules);
    if (hasDifferentRules) {
      setFileNameLoad(state?.l.view.name!)
    }
  }, [rulesToSave]);

  //---------Сохранение и использование сохраненных пользовательских настроек
  const [fileName, setFileName] = useState('');
  const [saveEnable, setSaveEnable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resourceData, setResourceData] = useState<IResourceTabView[]>([]);
  const [curentRules, setCurentRules] = useState<FilterRow<any>[]>(rulesToSave);

  // чтобы файлы с бд отображались пользователю
  const loadResourceData = async () => {
    try {
      const res = await tabResource.load(type)
      setResourceData(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadResourceData();
  }, []);

  //сохранить настройки в бд
  const handleFormSubmit = async () => {
    try {
      setLoading(true);

      // Валидация ввода
      validationSchemaFileName.validateSync({ fileName });
      await tabResource.save(fileName, type, columns, rulesToSave, checkedColumns)
      // Успешное сохранение в базе данных, очистить форму и перезагрузить данные
      loadResourceData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setSaveEnable(false)
    }
  };

  //применяем  найстройки с файла загруженного с бд
  const loadTableSettings = (resource: { name: string, value: any }) => {
    const parsedValue = resource.value

    // Получаем столбцы и правила
    const newColumns = parsedValue.columns as SettingItem[];
    const newRulesToSave = parsedValue.rules as FilterRow<any>[];
    const mapKey = new Map<string, SettingItem>(newColumns.map(v => [v.field, v]))
    columns = columns.filter(column => mapKey.has(column.field as string))

    for (let i = 0; i < columns.length; i++) {
      const val = mapKey.get(columns[i].field as string)
      columns[i] = { ...columns[i], ...val }
    }

    // применяем новые и настройки
    onChangedRules(newRulesToSave);
    setFileNameLoad(resource.name)
    onChangedColumns(columns);
    setCurentRules(newRulesToSave);

    // ключи из resource.value и устанавливаем их как отмеченные галочки
    const newCheckedColumns = newColumns.map((column: SettingItem) => column.field);
    setCheckedColumns(newCheckedColumns);
  };

  //применяем  найстройки с файла загруженного с компа
  const handleFileUpload = (file: any) => {
    const reader = new FileReader();

    // После чтения файла
    reader.onload = async (event) => {
      //  содержимое файла из event.target.result
      let content: any = event.target?.result;
      if (content) {
        try {
          // Проверяем, что файл имеет расширение .json
          const fileName = file.name;
          const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
          if (fileExtension !== "json") {
            message.error(transl?.invalidFile)
            throw new Error("invalid file. Need .json");
          }

          // Парсим содержимое файла в формате JSON
          const parsedValue = content;
          // Получаем столбцы и правила
          const newColumns = parsedValue.columns as SettingItem[];
          const newRulesToSave = parsedValue.rules as FilterRow<any>[];
          const mapKey = new Map<string, SettingItem>(newColumns.map(v => [v.field, v]))
          columns = columns.filter(column => mapKey.has(column.field as string))

          for (let i = 0; i < columns.length; i++) {
            const val = mapKey.get(columns[i].field as string)
            columns[i] = { ...columns[i], ...val }
          }

          const updatedFileName = fileName.endsWith(".json") ? fileName.substring(0, fileName.length - 5) : fileName;
          setFileNameLoad(updatedFileName)
          // Применяем новые столбцы
          onChangedColumns(columns);
          // ключи из resource.value и устанавливаем их как отмеченные галочки
          const newCheckedColumns = newColumns.map((column: SettingItem) => column.field);
          setCheckedColumns(newCheckedColumns);
          onChangedRules(newRulesToSave);
          //-----Cохраняем настройки в бд
          await ResourceApi.save({
            name: fileName,
            type: type,
            value: {
              columns: newColumns,
              rules: rulesToSave
            }
          });

          loadResourceData();
        } catch (error) {
          console.error(error);
        }
      }
    };

    // Читаем файл как текстовый файл
    reader.readAsText(file);
  };

  // удаляем файл из бд
  const deleteResourseDB = async (fileName: string) => {
    try {
      await tabResource.del(fileName, type)
      await loadResourceData();
    } catch (error) {
      console.log(error);
    }
  };

  //файл из бд сохраняем на комп
  const exportResource = (resource: { name: string, value: any }) => {
    const jsonObject = resource.value;
    FileSaverLocal.saveJSON(jsonObject, `${resource.name}`)
  };

  return (
    <>
      <Modal
        width={"29rem"}
        title={transl?.title}
        open={visibleModal}
        afterOpenChange={() => { loadResourceData() }}
        style={{ minHeight: "20rem" }}
        maskClosable
        onCancel={() => handleCloseModal(false)}
        footer={null}
      >
        <Row gutter={24} style={{ display: 'flex' }}>
          <Col>
            <Form style={{ display: 'flex', alignItems: 'center' }}>
              <Space size="small" direction="horizontal">
                <Input
                  type="text"
                  name="fileName"
                  disabled={loading}
                  style={{ width: '21rem', display: 'flex' }}
                  placeholder={transl!.fileName}
                  maxLength={32}
                  onPressEnter={handleFormSubmit}
                  value={fileName}
                  onChange={(e) => {
                    setSaveEnable(true)
                    setFileName(e.target.value)
                  }}
                  required
                />

                <Button
                  aria-label='save-button'
                  type="primary"
                  htmlType="submit"
                  disabled={!saveEnable}
                  icon={<SaveOutlined />}
                  loading={loading}
                  onClick={handleFormSubmit}
                />
                <Upload accept=".json" showUploadList={false} beforeUpload={(file) => handleFileUpload(file)}>
                  <Button icon={<DownloadOutlined />} />
                </Upload>
              </Space>
            </Form>
          </Col>
          <Col>
            <Text type="secondary" style={{ width: "100%" }}>{transl?.textSave}</Text>
            <br />
            <Text type="secondary">{transl?.importFromLocal}</Text>
          </Col>
        </Row>
        <Divider />
        <div style={{ maxHeight: '15rem', overflow: 'auto' }}>
          {resourceData.map((resource) => (
            <Row key={resource.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{resource.name}</span>
              <Col style={{ ...colRightCss }}>
                <Button type="text" onClick={() => loadTableSettings(resource)} >
                  <UploadOutlined />
                  Load
                </Button>
                <Button type="text" onClick={() => exportResource(resource)} >
                  Export
                </Button>
                <Button type="text" onClick={() => deleteResourseDB(resource.name)} >
                  Delete
                </Button>
              </Col>
            </Row>
          ))}
        </div>
        <Divider />

      </Modal>
    </>
  )

};

export default TabResource;
