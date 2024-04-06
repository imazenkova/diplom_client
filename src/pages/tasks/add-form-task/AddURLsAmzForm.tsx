
import { Form, Input } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { TypeTask } from '../../../shared.lib/api/task.api';
import { IReadUrlsAMZ } from '../../../shared.lib/api/task.data';
import { AddTaskDlgProps } from '../Tasks.types';
import { BaseTaskForm } from './BaseTaskForm';

export default class AddURLsAmzForm extends BaseTaskForm {
  constructor(props: AddTaskDlgProps) {
    super(props);
    this.width = 850
  }

  getInputData(vals: any) {
    const inputData: IReadUrlsAMZ = {
      urls: vals.urls.split('\n') || [],
      location: 'com'
    }
    return inputData
  }

  getTypeTask = (): TypeTask => 'readUrlsAMZ'

  addRender = (): JSX.Element => {
    const placeholderText = `${this.loc?.tasks.writeAsin}
    https://amazon.com/dp/asin1
    https://amazon.com/dp/asin2
    https://amazon.com/dp/asinN`

    return (<>

      <Form.Item
        name="urls"
        label="URLs"
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={15} placeholder={placeholderText} />
      </Form.Item>

    </>
    )
  }
}
