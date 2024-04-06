import { TypeTask } from '../../../shared.lib/api/task.api';
import { IReadTestUnits } from '../../../shared.lib/api/task.data';
import AddTestTaskForm from './AddTestTaskForm';

export default class AddTestUnitsForm extends AddTestTaskForm {

  getInputData(vals: any): any {

    const timoutStepMs = [parseInt(vals.timoutStepMs.from)]
    if (vals.timoutStepMs.to)  timoutStepMs.push(parseInt(vals.timoutStepMs.to))

    const inputData: IReadTestUnits = {
      units: Array(parseInt(vals.numberofStep)).fill({timoutStepMs})
    };
    return inputData
  }

  getTypeTask = (): TypeTask => 'readTestUnits'

}


