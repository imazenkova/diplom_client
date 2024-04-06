import { Form, Input } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { TypeTask } from '../../../shared.lib/api/task.api';
import { IReadUrlsEbay } from '../../../shared.lib/api/task.data';
import { AddTaskDlgProps } from '../Tasks.types';
import { BaseTaskForm } from './BaseTaskForm';

export default class AddURLsEbayForm extends BaseTaskForm {
  constructor(props: AddTaskDlgProps) {
    super(props);
    this.width = 850
  }

  getInputData(vals: any) {
    const inputData: IReadUrlsEbay = {
      urls: vals.urls.split('\n') || [],
    }
    return inputData
  }

  getTypeTask = (): TypeTask => 'readUrlsEbay'

  addRender = (): JSX.Element => {
    const placeholderText = `${this.loc?.tasks.writeAsin}
    https://www.ebay.com/itm/404378543074
    https://www.ebay.com/itm/404378534913
    https://www.ebay.com/itm/404373333897`

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
