import { Form, Input } from 'antd';
import { JSX } from 'react/jsx-runtime';
import { TypeTask } from '../../../shared.lib/api/task.api';
import { IReadTestTask } from '../../../shared.lib/api/task.data';
import { AddTaskDlgProps } from '../Tasks.types';
import { BaseTaskForm } from './BaseTaskForm';

export default class AddTestTaskForm extends BaseTaskForm {
  constructor(props: AddTaskDlgProps) {
    super(props);
    this.width = 500
  }

  initialValues: any = {
    name: "test",
    timoutStepMs: {
      from: "100"
    },
    numberofStep: "1000"
  }

  getInputData(vals: any): any {
    const inputData: IReadTestTask = {
      timoutStepMs: [parseInt(vals.timoutStepMs.from), vals.timoutStepMs.to ? parseInt(vals.timoutStepMs.to) : undefined],
      numberofStep: parseInt(vals.numberofStep)
    };
    return inputData
  }

  getTypeTask = (): TypeTask => 'readTestTask'

  addRender = (): JSX.Element => (<>
    <Form.Item
      label={this.loc!.addTestTaskForm.timeOutStep}
      required
    >
      <Input.Group compact>
        <Form.Item
          name={['timoutStepMs', 'from']}
          label={this.loc!.addTestTaskForm.timeOutStep}
          noStyle
          rules={[{ required: true }]}
        >
          <Input type="number" style={{ width: '60%' }} placeholder="От" />
        </Form.Item>
        <Form.Item
          name={['timoutStepMs', 'to']}
          noStyle
        >
          <Input type="number" style={{ width: '40%' }} placeholder={this.loc!.addTestTaskForm.byNotRequired}/>
        </Form.Item>
      </Input.Group>
    </Form.Item>

    <Form.Item
      name="numberofStep"
      label={this.loc!.addTestTaskForm.unitsSum}
      rules={[{ required: true }]}
    >
      <Input type="number" />
    </Form.Item>

  </>
  )
}

