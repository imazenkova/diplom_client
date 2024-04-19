import { Form, Input,App } from 'antd';
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
    const urls = vals.urls.split(/[\n,; ]+/).filter((url:string) => url.trim() !== '');
  
    const ebayUrls = urls.filter((url:string) => {
      // Проверяем, что ссылка начинается с "http://" или "https://"
      if (!/^https?:\/\//i.test(url)) {
        return false;
      }
  
      // Проверяем, что ссылка содержит "ebay.com" в домене
      if (!/ebay\.com/i.test(url)) {
        return false;
      }
  
      return true;
    });
  
    const inputData: IReadUrlsEbay = {
      urls: ebayUrls || [],
    };
  
    return inputData;
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
