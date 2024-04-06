
import { CopyOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Divider, Form, Input, Row, Segmented, Steps, Typography, Upload } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { JSX } from 'react/jsx-runtime';
import { ResourceApi } from '../../../api/resource.api.cli';
import { CSVReader, FilterRowType } from '../../../components/file-process/csv';
import { XLSXReader } from '../../../components/file-process/xlsx';
import { IItemTypeResource } from '../../../shared.lib/api/resource.api';
import { TypeTask } from '../../../shared.lib/api/task.api';
import { IComparePricesColumns, IComparePricesWithKeepa } from '../../../shared.lib/api/task.data';
import { getMismatchedValues } from '../../../shared.lib/plugins/keepa-setting';
import { colLeftCss } from '../../../styles/grid.styles';
import FileUplader from '../../price-comparator/FileUploader';
import { findComparePricesConfig } from '../../price-comparator/find-compare-prices-config';
import { AddTaskDlgProps } from '../Tasks.types';
import keepaPreset from './../../price-comparator/keepa-preset/ASINExpert.keepaPreset.json';
import { BaseTaskForm } from './BaseTaskForm';
import { FileUtils } from '../../../components/file-process/file-utils';

const { Text } = Typography;

const MIMES = {
  xlsx: ".xlsx",
  csv: ".csv",
  tsv: ".tsv",
  //json: "application/json",
}

export type ComparePricesSupplier = IComparePricesWithKeepa['supplier'][number]

const ACCEPT_UPLOAD = Object.keys(MIMES).map(v => v).join(',')
const UPC_COL: (keyof IComparePricesColumns)[] = ['upc', 'ean']

const stateInit = {
  keepaFileName: '',
  fileList: [] as UploadFile[],
  fileSupplierInfo: new Map<string, ComparePricesSupplier>(),
  currentStep: 0,
  isAllOut: false,
  csvDelimiter: ','
};

export default class AddComparePricesWithKeepaForm extends BaseTaskForm<typeof stateInit> {
  state = stateInit

  constructor(props: AddTaskDlgProps) {
    super(props);
    this.width = 850
  }

  getInputData(vals: any) {
    const cpss: ComparePricesSupplier[] = []

    this.state.fileList.forEach(v => {
      const cps = this.state.fileSupplierInfo.get(v.uid)!
      cps.fileName = v.response.filename as string
      cpss.push(cps)
    })

    const inputData: IComparePricesWithKeepa = {
      comparerField: UPC_COL,
      supplier: cpss,
      isAllOut: this.state.isAllOut,
      keepa: {
        fileName: this.state.keepaFileName
      }
    }

    return inputData
  }

  getTypeTask = (): TypeTask => 'comparePricesWithKeepa'

  setKeepaFileName = (filename: string) => {
    this.setState({ keepaFileName: filename });
    this.formRef.current?.setFieldsValue({
      fileKeepaUploaded: true
    })
    this.setState({ currentStep: 3 })
  }

  getKeepaPresetButton = () => {
    const saveKeepaPresetToFile = () => {
      // Преобразуйте объект JSON в строку
      const jsonData = JSON.stringify(keepaPreset);

      // Создайте blob из строки JSON
      const blob = new Blob([jsonData], { type: 'application/json' });

      // Создайте временную ссылку на этот blob
      const url = URL.createObjectURL(blob);

      // Создайте временный элемент "a", чтобы запустить скачивание
      const a = document.createElement('a');
      a.href = url;
      a.download = 'keepaPreset.json';

      // Имитируйте клик по этой ссылке
      a.click();

      // Освободите URL после скачивания
      URL.revokeObjectURL(url);
    }
    return <Button type='text' size='small' onClick={saveKeepaPresetToFile}>{this.loc?.comparePrice.downloadPreset}</Button>
  }

  setSuplierFileNames = (param: UploadChangeParam) => {
    if (param.file.response && param.fileList) {
      if (param.fileList.length !== 0) {
        this.setState({
          fileList: param.fileList
        })
        this.formRef.current?.setFieldsValue({
          supplierUploaded: true
        })
        this.setState({ currentStep: 1 })
      }
      else {
        this.setState({ fileList: [] })
        this.formRef.current?.setFieldsValue({
          supplierUploaded: undefined
        })
        this.setState({ currentStep: 0 })
      }
    }
  }

  copyUPCAndOpenKeepa = async () => {
    await this.copyUPC()
    window.open('https://keepa.com/#!viewer', '_blank'); // открывает ссылку в новом окне или вкладке
  }

  copyUPC = async () => {
    const filterRow: FilterRowType = (columnsData) => {
      return columnsData.some(column => !!column);
    }

    let upcData: string[][] = []

    for (let i = 0; i < this.state.fileList.length; i++) {
      const file = this.state.fileList[i];

      const ext = FileUtils.getFileExtension(file.name)
      const comparePricesSupplier = this.state.fileSupplierInfo.get(file.uid)

      const nameCols = UPC_COL.map(nCol => comparePricesSupplier?.columns[nCol] as string).filter(v => (v))
      if (ext === MIMES.csv) {
        const upcDataLoc = await CSVReader.readColumnFromFile(file.originFileObj!, nameCols, filterRow, comparePricesSupplier?.csv?.delimeter)
        upcData.push(...upcDataLoc)
      } else if (ext === MIMES.tsv) {
        const upcDataLoc = await CSVReader.readColumnFromFile(file.originFileObj!, nameCols, filterRow, '\t')
        upcData.push(...upcDataLoc)
      } else if (ext === MIMES.xlsx) {
        const upcDataLoc = await XLSXReader.readColumnFromFile(file.originFileObj!, nameCols, filterRow)
        upcData.push(...upcDataLoc)
      }
    }

    if (upcData.length === 0) {
      this.props.useApp.message.error(`${this.loc?.comparePrice.notFoundCodeInFile}`);
      return
    }

    const upcString = upcData.map(row => row.join('\t')).join('\n');

    try {
      await navigator.clipboard.writeText(upcString);
      this.props.useApp.message.success(`${this.loc?.comparePrice.succCopy}`);
    } catch (err) {
      console.error(`${this.loc?.comparePrice.errorCopy}`, err);
      this.props.useApp.message.error(`${this.loc?.comparePrice.errorCopyText(err)}`);;
    }

    this.setState({ currentStep: 2 })
  }

  async chooseConfigDialog(options: string[]): Promise<number> {
    let selectedIndex = 0
    return new Promise((resolve) => {
      this.props.useApp.modal.confirm({
        title:`${this.loc?.comparePrice.chooseTemplate}`,
        icon: null,
        content: (
          <>
            <div style={{ ...colLeftCss }}>
              <Segmented options={options} onChange={(value) => {
                selectedIndex = options.findIndex(opt => opt === value)
              }} />
            </div>
          </>
        ),
        centered: true,
        onOk: () => { resolve(selectedIndex) },
        //cancelButtonProps: { style: { display: 'none' } },
        onCancel: () => { resolve(-1); }  // если пользователь закрыл диалог без выбора
      });
    });
  }


  beforeUploadKeepa = async (file: RcFile, FileList: RcFile[]) => {
    let nameColums: string[] = []
    const ext = FileUtils.getFileExtension(file.name)
    if (ext === MIMES.xlsx) {
      nameColums = await XLSXReader.readHeaderFromFile(file)
    } else {
      this.props.useApp.message.error(`${this.loc?.comparePrice.notCorrectFile}`);
      return Upload.LIST_IGNORE;
    }

    const notCols = getMismatchedValues(nameColums)
    if (notCols.length > 0) {
      this.props.useApp.modal.error({
        content: (
          <>
            <div>
              {`${this.loc?.comparePrice.missingRequireFields}`}
            </div>
            <div>{this.loc?.comparePrice.saveTempAndSaveKeepa}{this.getKeepaPresetButton()}</div>
            <ul style={{ textAlign: 'left', paddingLeft: '1rem' }}>
              {notCols.map((col, idx) => (
                <li key={idx}>{col}</li>
              ))}
            </ul>
          </>
        ),
      });
      this.props.useApp.message.error(`${file.name} is not a ${Object.values(MIMES).join(', ')} file`);
      return Upload.LIST_IGNORE;
    }
  }


  loadResourceData = async (): Promise<IComparePricesColumns[]> => {
    let res: IComparePricesColumns[] = []
    try {
      const resourcePayload: IItemTypeResource = {
        type: 'PricesTemplate',
        respValue: true,
      };

      // Вызываем метод loadList из ResourceApi для загрузки одного файла c бд
      const resAnsw = await ResourceApi.loadList(resourcePayload);

      if (resAnsw) {
        res = resAnsw.map(v => v.value)
      }

      return res
    } catch (error) {
      console.log(error);
    }
    return res
  };


  beforeUploadSupplier = async (file: RcFile, FileList: RcFile[]) => {
    let nameColums: string[] = []
    const supplier: ComparePricesSupplier = { fileName: '' } as ComparePricesSupplier

    const ext = FileUtils.getFileExtension(file.name)
    if (ext === MIMES.csv) {
      nameColums = await CSVReader.readHeaderFromFile(file, this.state.csvDelimiter)
      supplier.csv = { delimeter: this.state.csvDelimiter }
    } else if (ext === MIMES.tsv) {
      nameColums = await CSVReader.readHeaderFromFile(file, '\t')
    } else if (ext === MIMES.xlsx) {
      supplier.xlsx = {}
      nameColums = await XLSXReader.readHeaderFromFile(file)
    } else {
      this.props.useApp.message.error(`${this.loc?.comparePrice.notCorrectFile}`);
      return Upload.LIST_IGNORE;
    }

    const userConfigs = await this.loadResourceData()
    let configOptions = findComparePricesConfig(nameColums, userConfigs)
    if (configOptions.length === 0) {
      this.props.useApp.message.error(` ${this.loc?.comparePrice.notFoundTempForFile(file.name)}`);
      return Upload.LIST_IGNORE;
    } else if (configOptions.length > 1) {
      const options: string[] = configOptions.map((v, i) => `${i + 1}: ` + v.$name)
      const selectedConfigIndx = await this.chooseConfigDialog(options);
      if (selectedConfigIndx < 0) return Upload.LIST_IGNORE
      configOptions = [configOptions[selectedConfigIndx]]
    }

    supplier.columns = configOptions[0]
    this.state.fileSupplierInfo.set(file.uid, supplier)
    console.log('supl json', supplier.columns)
  }


  firstRender = (): JSX.Element => {
    return <Form.Item>
      <Steps direction='horizontal' size="small" style={{ paddingTop: '0.8rem' }} current={this.state.currentStep}
        items={[{ title: this.loc?.comparePrice.uploadSellerFile },
        { title:  this.loc?.comparePrice.copyUpcKeepa  },
        { title: this.loc?.comparePrice.uploadFileKeepa },
        { title: this.loc?.comparePrice.finish },
        ]}
      />
    </Form.Item>
  }

  optionParamRender = (): JSX.Element => {
    return <Row>
      <Col span={0}></Col>
      <Form.Item label={this.loc?.comparePrice.cutCSV}>
        <Input size='small' value={this.state.csvDelimiter} onChange={v => this.setState({ csvDelimiter: v.target.value })} ></Input>
      </Form.Item>
    </Row>
  }

  addRender = (): JSX.Element => {
    return (<>
      <Row gutter={2}>
        <Col span={12}>
          <Form.Item
            name="supplierUploaded" rules={[
              { required: true, message: `${this.loc?.comparePrice.uploadFile}` }
            ]}>
            <div>
              <Text type="secondary">1. </Text>
              <Checkbox checked={this.state.fileList.length !== 0}>
                {(this.state.fileList.length > 0) ? `${this.loc?.comparePrice.uploadedFiles(this.state.fileList.length)}` : `${this.loc?.comparePrice.uploadSellerFile}` }
              </Checkbox>
              <FileUplader accept={ACCEPT_UPLOAD} beforeUpload={this.beforeUploadSupplier} onChange={this.setSuplierFileNames}>
                <Button type='text' icon={<UploadOutlined />}></Button>
              </FileUplader>
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Text type="secondary">2. </Text>
          <Button disabled={this.state.fileList.length === 0} type='text' icon={<CopyOutlined />} onClick={this.copyUPC}>{this.loc?.comparePrice.copyUPC}</Button>
          <Button disabled={this.state.fileList.length === 0} type='text' icon={<CopyOutlined />} onClick={this.copyUPCAndOpenKeepa}>{this.loc?.comparePrice.openKeepa}</Button>
        </Col>
      </Row>
      <Row>
        <Form.Item
          name="fileKeepaUploaded" rules={[
            { required: true, message: `${this.loc?.comparePrice.uploadFile}` }
          ]}>
          <div>
            <Text type="secondary">3. </Text>
            <Checkbox checked={this.state.keepaFileName !== ''}>
              {(this.state.keepaFileName !== '') ? `${this.loc?.comparePrice.succUpload}` : `${this.loc?.comparePrice.uploadFileKeepaXLSX}`}
            </Checkbox>
            <FileUplader accept={MIMES.xlsx} beforeUpload={this.beforeUploadKeepa} showUploadList={false} onUploadSuccess={this.setKeepaFileName}>
              <Button type='text' icon={<UploadOutlined />}></Button>
            </FileUplader>
          </div>
        </Form.Item>
      </Row>
      <Divider></Divider>
      <Form.Item
        name="withoutUPC">
        <div>
          <Checkbox checked={this.state.isAllOut} onChange={(v) => { this.setState({ isAllOut: v.target.checked }) }}>
          {this.loc?.comparePrice.displayTable}
          </Checkbox>
          {this.getKeepaPresetButton()}
        </div>
      </Form.Item>
    </>
    )
  }
}
