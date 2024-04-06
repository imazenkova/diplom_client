
import { Form, Input, Select } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { TypeTask } from '../../../shared.lib/api/task.api';
import { IExistListFromQuerySuplWB, WBDESTValues } from '../../../shared.lib/api/task.data';
import { AddTaskDlgProps } from '../Tasks.types';
import { BaseTaskForm } from './BaseTaskForm';

export default class AddExistListFromQuerySuplWBForm extends BaseTaskForm {

  constructor(props: AddTaskDlgProps) {
    super(props);
    this.width = 850
  }

  getInputData(vals: any) {
    const inputData: IExistListFromQuerySuplWB = {
      queries: vals.queries.trim().split('\n') || [],
      dest: vals.dest,
      supplier: parseInt(vals.idSupl)
    }

    return inputData
  }

  getTypeTask = (): TypeTask => 'existListFromQuerySuplWB'

  addRender = (): JSX.Element => {
    const placeholderText1 = `${this.loc?.addWBForm.writeQueries}
    query1
    query2
    ...
    queryN`

    return (<>
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


      <Form.Item
        name="idSupl"
        label={this.loc?.addWBForm.idSupl}
        rules={[{ required: true }]}
        style={{ paddingRight: 16 }}
      >
        <Input type="number" />
      </Form.Item>

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
