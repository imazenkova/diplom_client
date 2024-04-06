import { useRef } from 'react';
import { ASINColumns } from '../../../../components/table/asin-table-columns';
import ASINTable from '../../../../components/table/asin-table/ASINTable';
import { TypeResource } from '../../../../shared.lib/api/resource.api';
import { ITaskInfoRes } from '../../../../shared.lib/api/task.api';

export interface ViewResultTableProps {
  resource: TypeResource,
  columns: () => ASINColumns,
  data: ITaskInfoRes,
  onSave?: (taskInfoRes: ITaskInfoRes, resultData: any[]) => Promise<void>
  //Дополнительные кнопку в хедар
  addButtonsComponent?: React.ReactNode;
}

const ViewResultTable: React.FC<ViewResultTableProps> = (props) => {
  const { resource, columns, data, onSave, addButtonsComponent } = props
  const dataSource = useRef(data.resultData)
  return (
    <>
      <ASINTable
        resource={resource}
        baseTable={{
          name: data.name,
          dataSource: data.resultData!,
          columns: columns(),
        }}
        onChangeDataSource={(ds) => dataSource.current = ds}
        onSave={onSave ? async (dataSourceNew) => onSave(data, dataSourceNew) : undefined}
        addButtonsComponent={addButtonsComponent}
      />
    </>
  );
};

export default ViewResultTable;
