
import { Form, Input } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { TypeTask } from '../../../shared.lib/api/task.api';
import { IReadAsinsAMZ } from '../../../shared.lib/api/task.data';
import { AddTaskDlgProps } from '../Tasks.types';
import { BaseTaskForm } from './BaseTaskForm';

export default class AddASINsAmzForm extends BaseTaskForm {
  constructor(props: AddTaskDlgProps) {
    super(props);
    this.width = 850
  }

  getInputData(vals: any) {
    const inputData: IReadAsinsAMZ = {
      asins: vals.asins.split('\n') || [],
      location: 'com'
    }
    return inputData
  }

  getTypeTask = (): TypeTask => 'readAsinsAMZ'

  addRender = (): JSX.Element => {
    const placeholderText = `${this.loc?.tasks.writeAsin}
  asin1, asin2
  asin1 asin2
  asin1; asin2
  asin1
  asin2`

    return (<>

      <Form.Item
        name="asins"
        label="ASINs"
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={15} placeholder={placeholderText} />
      </Form.Item>

    </>
    )
  }
}
