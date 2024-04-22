import { App, Col, Divider, Input, Row, Space, Spin, Steps, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { RcFile } from 'antd/lib/upload';
import { useContext, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { ResourceApi } from "../../api/resource.api.cli";
import { AppSettig } from '../../app.setting';
import { CSVReader } from '../../components/file-process/csv';
import { FileUtils } from '../../components/file-process/file-utils';
import { JSONReader } from '../../components/file-process/json';
import { XLSXReader } from '../../components/file-process/xlsx';
import TabulatorNative from '../../components/table/tabulator-tables/TabulatorNative';
import { useHeaderMenu } from '../../hooks/useMenu';
import { IItemResource, TypeResource } from "../../shared.lib/api/resource.api";
import { IComparePricesColumns, calcRowFormula } from "../../shared.lib/api/task.data";
import { colCenterCss } from '../../styles/grid.styles';
import { themeDef } from '../../styles/theme.app.def';
import { menuTemplate } from './ResorceTemplate.menu';
import { customMentionFormatter, customSelectFormatter } from './template.formatters';
import { DataItem, createComparePricesTemplate, emptyComparePricesColumns, getUniqueKeysFromData } from './template.types';

import { Upload } from 'antd';
import { ColumnDefinition } from 'tabulator-tables';
import { createDefColumn } from '../../components/table/asin-table-columns';
import { ApiError } from '../../shared.lib/api/errors';


const columns = emptyComparePricesColumns(''); // Создаем объект
const keysWithoutDollarSign = Object.keys(columns).filter(key => !key.startsWith('$')); // Фильтруем ключи без служебных
//Файлы поставщиков которые мы можем загружать
const MIMES = { xlsx: ".xlsx", csv: ".csv", tsv: ".tsv", json: ".json" }
const acceptFileDlg = Object.values(MIMES).join(',')

const ResorceTemplate: React.FC<{ editMode: boolean }> = ({ editMode }) => {
  const { modal, message } = App.useApp()
  const type: TypeResource = "PricesTemplate" //для сохранения в бд
  const { state } = useContext<ContextType>(AppContext);

  const currentUrl = new URL(window.location.href);
  const location = useLocation();
  const urlParamObj = new URLSearchParams(location.search)//используем для получения и установки значения в парметр url
  const templateNameParam = urlParamObj.get('fileName');
  const pathname = location.pathname;

  const [changeTab, setChangeTab] = useState(false);//отображение таблицы после загрузки файла с компа  или edit
  const [enableCheckBtn, setEnableCheckBtn] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');


  const initialData: DataItem[] = keysWithoutDollarSign.map((key, index) => ({
    compare: key as keyof IComparePricesColumns,
    upload: (key as keyof IComparePricesColumns === 'attr') ? [] : '',
    formula: "",
    calcExamp: ""
  }));

  const [data, setData] = useState<DataItem[]>(initialData);//данные для использования в таблице

  const loadResourceData = async () => {//при edit загружаем данные для таблицы из бд по url параметру(=как имя файла)
    try {
      if (templateNameParam !== null) {
        let updatedFileName = templateNameParam;
        updatedFileName += ".json";
        const resourcePayload: IItemResource = {
          name: updatedFileName,
          type: type,
        };

        // Вызываем метод loadList из ResourceApi для загрузки одного файла c бд
        const res = await ResourceApi.load(resourcePayload);

        if (res.resource) {// полученный шаблон фоомируем в данные для использования в тааблице
          const [one] = res.resource
          const loadTemplate = one.value
          const fileRows = one.value2 || []
          const newData: DataItem[] = [];

          for (const key in loadTemplate) {
            if (Object.prototype.hasOwnProperty.call(loadTemplate, key) && !key.startsWith('$')) {
              const value = loadTemplate[key];
              const upload = typeof value === 'object' && 'formula' in value ? 'formula' : value;
              const formula = typeof value === 'object' && 'formula' in value ? value.formula : '';

              newData.push({
                compare: key as keyof IComparePricesColumns,
                upload: upload,
                formula: formula,
                calcExamp: ''
              });
            }
          }

          setData(newData);
          const keys = getUniqueKeysFromData(fileRows)
          setUploadObjectKeys(keys)
          setUploadData(fileRows)
          setChangeTab(true)//можно отрисовывать таблицу
          setUploadedFileName('template.json') //встроенный файл
        }
      }
      else {
        message.error(state?.l.priceCmp.errorUrl)
        throw new Error("Empty url param")
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (pathname === AppSettig.routePath.templateEdit) {// если путь соотв путю edit , то загружаем с бд файл
      loadResourceData()
    }
  }, [pathname]);


  useEffect(() => {
    try {
      const template = createComparePricesTemplate('temp', data, keysWithoutDollarSign);//формирование шаблона
      // Тестим данные перед сохранением
      if (!uploadData || uploadData.length === 0) return
      const calcs = calcRowFormula(template, [uploadData[0]], false);
      if (!calcs || (calcs.length < 1 || Object.keys(calcs[0]).length === 0)) return
      const calc: any = calcs[0]

      const sData = JSON.stringify(data)
      if (sData !== JSON.stringify(initialData)) setEnableCheckBtn(true)

      for (let i = 0; i < data.length; i++) {
        data[i].calcExamp = calc[data[i].compare]
      }
      const newData = JSON.stringify(data)

      if (sData !== newData) {
        setData([...data])
      }

    } catch (e) {
      console.error('err', e)
    }

  }, [data])

  const columns: ColumnsType<any> = [
    { dataIndex: "compare", title: `${state!.l.resourceTemplate.fields}`, width: '9rem', key: "compare" },
    {
      dataIndex: "upload", title: `${state!.l.resourceTemplate.sellersFields}`, key: "upload", render: (text: string, record: DataItem) => {
        return customSelectFormatter(record.compare as keyof IComparePricesColumns, record, setData, data, uploadObjectKeys);
      }, width: '13rem'
    },
    {
      dataIndex: "formula", title: `${state!.l.resourceTemplate.formula}`, key: "formula", width: "25rem",
      render: (text: string, record: DataItem) => {
        return customMentionFormatter(record.compare, record, setData, data, uploadObjectKeys,state!);
      },
    },
    {
      dataIndex: "calcExamp", title: `${state!.l.resourceTemplate.checkColumn}`, key: "calcExamp",
      render: (text: string, record: DataItem) => {
        return text
      },
    }

  ];

  const [uploadObjectKeys, setUploadObjectKeys] = useState<any[]>([]);//Для форумл выводить c @
  const [uploadData, setUploadData] = useState<any[]>([]);// данные полученные с файла ,загруженного с компа

  const firstState = () => {
    setData(initialData)
    setEnableCheckBtn(false)
    if (!editMode) setTemplName('')
  }

  const loadFile = async (file: RcFile): Promise<any[] | null> => {
    const ext = FileUtils.getFileExtension(file.name)
    let res: any[]
    if (ext === MIMES.csv) {
      res = await CSVReader.convertToJSON(file)
    } else if (ext === MIMES.tsv) {
      res = await CSVReader.convertToJSON(file, '\t')
    } else if (ext === MIMES.xlsx) {
      res = await XLSXReader.convertToJSON(file)
    } else if (ext === MIMES.json) {
      res = await JSONReader.readJSON(file)
    }
    else {
      const type = Object.values(MIMES).join(', ')
      message.error(`${state?.l.resourceTemplate.notCorrectFile(file.name, type)}`);
      return null
    }

    return res
  }

  const setUploadedFile = async (uploadedFile: RcFile): Promise<string | undefined> => {
    if (uploadedFile) {
      setUploadedFileName(uploadedFile.name)
      setIsLoading(true)

      if (!editMode) firstState()

      try {
        const parsedData = await loadFile(uploadedFile)
        debugger
        if (parsedData === null) return Upload.LIST_IGNORE
        const keys = getUniqueKeysFromData(parsedData)
        setUploadData(parsedData);
        setUploadObjectKeys(keys)
        setChangeTab(true)
      }
      catch (error) {
        message.error(`${state!.l.resourceTemplate.errorFileParsing} ${ApiError.From(error).getFullMessage('; ')}`);
      }
      finally {
        setIsLoading(false)
      }
    }
  }

  //Сохранение в бд
  const [isLoading, setIsLoading] = useState(false)// для блокировки формы
  const [templName, setTemplName] = useState(templateNameParam || '');

  const deleteResourceDB = async (fileName: string) => {// удаление ресура в бд
    try {
      let updatedFileName = fileName;
      if (!updatedFileName.endsWith(".json")) {
        updatedFileName += ".json";
      }
      const resourcePayload: IItemResource[] = [{
        name: updatedFileName,
        type: type,
      }];
      await ResourceApi.delete(resourcePayload);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async () => {//сохраняем в бд ресурс
    try {
      debugger
      if (templateNameParam) { await deleteResourceDB(templateNameParam); }
      setIsLoading(true)
      // Валидация ввода
      if (!templName) throw Error(state?.l.resource.required + ' name')

      let updatedFileName = templName.trim();
      if (!updatedFileName.endsWith('.json')) {
        updatedFileName += '.json';
      }

      const template = createComparePricesTemplate(templName, data, keysWithoutDollarSign);//формирование шаблона
      // Тестим данные перед сохранением
      const result = calcRowFormula(template, uploadData);
      const first10UploadData = uploadData.slice(0, 10);//чтобы при edit можно было получить данные о файле , из которого был сформирован шаблон

      if (result.length !== 0) {
        await ResourceApi.save({
          name: updatedFileName,
          type: type,
          value: template,
          value2: first10UploadData
        });
        if (templateNameParam) {
          currentUrl.searchParams.set('fileName', templName);//изменяем url параметр , тк имя сохр файла может поменяться => мпняется параметр url:
          const updatedUrl = currentUrl.toString();
          // Заменяем текущий URL без перезагрузки страницы
          window.history.replaceState(null, '', updatedUrl);
        }

        message.success(state?.l.priceCmp.saveTemp)
      } else message.error(state?.l.priceCmp.notCorrectTemp)

    } catch (error) {
      console.log(error);
      message.error(`${state!.l.resourceTemplate.checkData}` + ApiError.From(error).getFullMessage(', '))
    } finally { setIsLoading(false) }
  };

  useEffect(() => {
    if (updateMenu) updateMenu(menuTemplate(acceptFileDlg, state?.l!, onViewResult, onViewSpl, setUploadedFile, templName, uploadedFileName, enableCheckBtn,
      handleFormSubmit, setTemplName,state!))
  }, [data, templName, uploadedFileName])

  const onViewResult = () => {
    const template = createComparePricesTemplate(templName, data, keysWithoutDollarSign);//формирование шаблона
    let result = calcRowFormula(template, uploadData)
      .map((v, id) => ({ id, ...v }));//получение результта

      const a =   createDefColumn(result, false)
      console.log("Colll,",a)
    const columns = createDefColumn(result, false).filter(v => !v.field?.startsWith('$'))
    modalData(result, columns, true)
  }

  const modalData = (data: any[], columns: ColumnDefinition[], useImg = false) => {
    const [width, height] = ['70vw', '60vh']
    modal.success({
      icon: null,
      transitionName: '',
      //centered: true,
      //width: width,
      style: { ...colCenterCss },
      content: (
        <>
          <div style={{ ...colCenterCss, width }}>
            <TabulatorNative
              options={{
                height: height,
                data: data,
                layout: 'fitDataTable',
                columns
              }} />
          </div>
        </>
      ),
    })
  }

  const onViewSpl = () => {
    modalData(uploadData, createDefColumn(uploadData, false))
  }

  const updateMenu = useHeaderMenu({
    items: menuTemplate(acceptFileDlg, state?.l!, onViewResult, onViewSpl, setUploadedFile, templName, uploadedFileName, enableCheckBtn,
      handleFormSubmit, setTemplName,state!)
  })

  return (<>
    <div
      style={{
        height: '100%', width: '100%',
        backgroundColor: themeDef.app.backgroundColor, boxShadow: themeDef.antd.boxShadowSecondary,
        borderRadius: themeDef.antd.borderRadius
      }} >

      {!changeTab && <div style={{ ...colCenterCss, height: '100%' }}>
        <Steps direction='vertical' size="default" style={{ paddingTop: '0.8rem', minWidth: '10rem', maxWidth: '25rem' }} current={0}
          items={[{ title: `${state!.l.resourceTemplate.uploadSellerPrice}` },
          { title: `${state!.l.resourceTemplate.bindFileds}` },
          { title:  `${state!.l.resourceTemplate.useFormula}` },
          { title:  `${state!.l.resourceTemplate.setNameAndSave}`  },
          { title: `${state!.l.resourceTemplate.getProfit}`  },
          ]}
        />

      </div>}

      <Spin spinning={isLoading} size="large" style={{ ...colCenterCss }}>
        {changeTab && <>
          <Row justify="space-between" align={'middle'} style={{ height: '2.3rem', paddingLeft: '0.8rem' }}>
            <Col>
              <Space align='center'>
                <Input
                  size='small'
                  type="text"
                  name="fileName"
                  style={{ width: '15rem' }}
                  maxLength={32}
                  placeholder={state?.l.priceCmp.template}
                  onPressEnter={handleFormSubmit}
                  value={templName}
                  onChange={(e) => setTemplName(e.target.value)}
                  required
                />
                <Divider type='vertical' />
                <Typography.Text type="secondary">{uploadedFileName}</Typography.Text>
              </Space>
            </Col>
          </Row>
          <Row>

            <Table rowKey={columns[0].key as string} pagination={false} columns={columns} size='large' style={{ height: '100%', width: "100%" }}
              dataSource={data}
            />
          </Row>
        </>}
      </Spin>
    </div>
  </>)
}


export default ResorceTemplate;
