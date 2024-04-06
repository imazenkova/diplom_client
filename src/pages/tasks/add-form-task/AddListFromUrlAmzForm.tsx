
import { Form, Input } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { TypeTask } from '../../../shared.lib/api/task.api';
import { IReadListFromUrlAMZ } from '../../../shared.lib/api/task.data';
import { AddTaskDlgProps } from '../Tasks.types';
import { BaseTaskForm } from './BaseTaskForm';

export default class AddListFromUrlAmzForm extends BaseTaskForm {
  constructor(props: AddTaskDlgProps) {
    super(props);
    this.width = 850
  }

  getInputData(vals: any) {
    const inputData: IReadListFromUrlAMZ = {
      url: vals.url,
      location: 'com'
    }
    return inputData
  }

  getTypeTask = (): TypeTask => 'readListFromUrlAMZ'

  addRender = (): JSX.Element => {

    return (<>

      <Form.Item
        name="url"
        label= {this.loc?.tasks.enterUrlList}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

    </>
    )
  }
}
