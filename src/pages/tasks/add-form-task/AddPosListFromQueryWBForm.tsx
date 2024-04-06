import { Row, Col, Form, Input, Radio, Select } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { TypeTask } from '../../../shared.lib/api/task.api';
import { IPosListFromQueryWB, MODE_QFILTER_WB, SKUWB_QUERY, WBDESTValues } from '../../../shared.lib/api/task.data';
import { AddTaskDlgProps } from '../Tasks.types';
import { BaseTaskForm } from './BaseTaskForm';

const stateInit = {
  mode: 'skuWB' as MODE_QFILTER_WB
};

export default class AddPosListFromQueryWBForm extends BaseTaskForm<typeof stateInit> {
  getTypeTask = (): TypeTask => 'posListFromQueryWB'

  state = stateInit

  constructor(props: AddTaskDlgProps) {
    super(props);
    this.width = 850
  }

  isFilter(): boolean {
    return true
  }

  toSKUWB_QUERY(vals: any): SKUWB_QUERY[] {
    const res: SKUWB_QUERY[] = []
    const skuWBs = vals.skuWB.trim().split('\n')

    skuWBs.forEach((v: string) => {
      const val = v.split(/,|\t|;/)
      const sq: SKUWB_QUERY = { skuWB: parseInt(val[0]) }
      if (val.length > 1) sq.skuSupl = val[1].trim()
      res.push(sq)
    });

    return res
  }


  getInputData(vals: any) {
    const inputData: IPosListFromQueryWB = {
      queries: vals.queries.trim().split('\n') || [],
      dest: vals.dest
    }
    debugger
    if (vals.deepRead) inputData.deepRead = parseInt(vals.deepRead)
    if (this.isFilter()) {
      inputData.filter = { mode: this.state.mode }
      if (this.state.mode === 'skuWB') {
        inputData.filter.skuWB = this.toSKUWB_QUERY(vals)
      } else {
        inputData.filter.supplier = [parseInt(vals.idSupl)]
      }
    }

    return inputData
  }

  addRender = (): JSX.Element => {
    const placeholderText1 = `${this.loc?.addWBForm.writeQueries}
  query1
  query2
  ...
  queryN`

    const placeholderText2 = `${this.loc?.addWBForm.writeSKUs}
  27959276 konf-12
  27959222,konf-24
  ...
  27959212,konf-12`


    return (<>
      <Row gutter={2}>
        <Col span={6}>
          <Form.Item
            name="dest"
            label={this.loc?.addWBForm.dest}
            initialValue={WBDESTValues[0]}
            style={{ width: 200 }}
          >
            <Select
              defaultValue={WBDESTValues[0]}
              style={{ width: 200 }}
              options={WBDESTValues.map(v => { return { value: v, label: v } })}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="deepRead"
            label={this.loc?.addWBForm.deepRead}
            style={{ paddingRight: 16 }}
            initialValue={8000}
          >
            <Input type="number" min={300} max={18000} placeholder='300-18000' />
          </Form.Item>
        </Col>
      </Row>

      {this.isFilter() &&
        <Radio.Group style={{ paddingBottom: 10 }} value={this.state.mode} onChange={(e) => this.setState({ mode: e.target.value })}>
          <Radio.Button value="skuWB">По артикулам WB</Radio.Button>
          <Radio.Button value="suplierId">По ID селлера</Radio.Button>
        </Radio.Group >
      }

      {this.isFilter() && this.state.mode === 'suplierId' &&
        <Form.Item
          name="idSupl"
          label={this.loc?.addWBForm.idSupl}
          rules={[{ required: true }]}
          style={{ paddingRight: 16 }}
        >
          <Input type="number" />
        </Form.Item>
      }

      {this.isFilter() && this.state.mode === 'skuWB' &&
        <Form.Item
          name="skuWB"
          label={this.loc?.addWBForm.skuWBs}
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={7} placeholder={placeholderText2} />
        </Form.Item>
      }

      {/* <Form.Item
        name="skuWB"
        label={this.loc?.addWBForm.skuWBs}
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={7} placeholder={placeholderText} />
      </Form.Item> */}

      <Form.Item
        name="queries"
        label={this.loc?.addWBForm.queries}
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={8} placeholder={placeholderText1} />
      </Form.Item>
    </>
    )
  }

}
