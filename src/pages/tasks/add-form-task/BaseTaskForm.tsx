import { Form, FormInstance, Input, Modal, Collapse } from 'antd';
import React from 'react';
import { AppContext } from '../../../AppContext';
import { TaskApi } from '../../../api/task.api.cli';
import { ApiError } from '../../../shared.lib/api/errors';
import { TypeTask } from '../../../shared.lib/api/task.api';
import { AddTaskDlgProps } from '../Tasks.types';
import { Translation } from '../../../locales/lang';

interface State {
}


export abstract class BaseTaskForm<TState = State> extends React.Component<AddTaskDlgProps, TState> {
  static readonly itemName = (loc: Translation) => {
    return <Form.Item label={loc.baseTaskForm.name} name={['name']} rules={[{ required: true }]} >
      <Input />
    </Form.Item>
  }

  static readonly itemDesc = (loc: Translation, optionParamRender?: () => JSX.Element) => {
    return <Collapse>
      <Collapse.Panel header={loc.baseTaskForm.additionalParameters} key="1">
        {optionParamRender && optionParamRender()}
        <Form.Item label={loc.baseTaskForm.description} name={['desc']}>
          <Input.TextArea rows={2} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  }

  static readonly defaultWidth = 600

  protected width: string | number = BaseTaskForm.defaultWidth
  formRef = React.createRef<FormInstance>();

  static contextType = AppContext; // Задаем contextType
  context!: React.ContextType<typeof AppContext>

  constructor(props: AddTaskDlgProps) {
    super(props);
    this.state = {} as TState;
  }


  get loc() {
    return this.context.state?.l
  }

  async onOkClick() {
    try {
      await this.formRef.current?.validateFields()
    }
    catch {
      return
    }

    const vals = this.formRef.current?.getFieldsValue()

    const typeTask = this.getTypeTask()
    const inputData = this.getInputData(vals)


    try {
      await TaskApi.addTask({
        name: vals.name,
        desc: vals.desc || '',
        type: this.getTypeTask(),
        inputData
      })
      this.props.handleDoneDlg('success', this.loc?.tasks.successAdd(this.loc.tasks.type[typeTask])!)
    } catch (error) {
      const e = ApiError.FromAxios(error)
      this.props.handleDoneDlg('error', this.loc?.tasks.successAdd(this.loc.tasks.type[typeTask])!, e.getFullMessage('\n'))
    }
  };


  initialValues: any = {}
  abstract addRender(): JSX.Element
  firstRender(): JSX.Element { return <></> }
  optionParamRender(): JSX.Element { return <></> }

  abstract getInputData(vals: any): any
  abstract getTypeTask(): TypeTask

  render() {
    return (<>
      <Modal title={this.loc?.tasks.addTaskTitle}
        centered
        open={true}
        onOk={() => this.onOkClick()}
        onCancel={() => this.props.handleCancelDlg()}
        width={this.width}
      >
        {this.firstRender()}

        <Form
          ref={this.formRef}
          layout="vertical"
          size='middle'
          initialValues={this.initialValues}

        //initialValues={{ size: componentSize }}
        //onValuesChange={onFormLayoutChange}
        //size={componentSize as SizeType}
        //style={{ maxWidth: 600 }}
        >
          {BaseTaskForm.itemName(this.loc!)}

          {this.addRender()}
          {BaseTaskForm.itemDesc(this.loc!, this.optionParamRender)}

        </Form>
      </Modal>
    </>
    );
  }
}
