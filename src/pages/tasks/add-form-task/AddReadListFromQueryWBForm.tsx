
import { TypeTask } from '../../../shared.lib/api/task.api';
import AddPosListFromQueryWBForm from './AddPosListFromQueryWBForm';

export default class AddReadListFromQueryWBForm extends AddPosListFromQueryWBForm {
  isFilter() {
    return false
  }

  getTypeTask = (): TypeTask => 'readListFromQueryWB'
}
