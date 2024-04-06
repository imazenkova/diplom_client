import { Form, Input } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { TypeTask } from '../../../shared.lib/api/task.api';
import { IReadListFromUrlEbay } from '../../../shared.lib/api/task.data';
import { AddTaskDlgProps } from '../Tasks.types';
import { BaseTaskForm } from './BaseTaskForm';

export default class AddListFromUrlEbayForm extends BaseTaskForm {
  constructor(props: AddTaskDlgProps) {
    super(props);
    this.width = 850
  }

  getInputData(vals: any) {
    const inputData: IReadListFromUrlEbay = {
      url: vals.url,
    }
    return inputData
  }

  getTypeTask = (): TypeTask => 'readListFromUrlEbay'

  addRender = (): JSX.Element => {

    return (<>

      <Form.Item
        name="url"
        label={this.loc?.tasks.enterUrlList}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

    </>
    )
  }
}


