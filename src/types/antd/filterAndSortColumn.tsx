import { Button, Input } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { ColumnFilterItem, FilterDropdownProps, SortOrder } from 'antd/es/table/interface';
import { DataIndex } from 'rc-table/lib/interface';
import { Key } from 'react';


export class FilterAndSort {
  public static Off<RecordType>(columns: ColumnsType<RecordType>) {
    for (let i = 0; i < columns.length; i++) {
      columns[i].onFilter = undefined
      columns[i].filterMode = undefined
      columns[i].filterDropdown = undefined
      columns[i].sorter = undefined
      columns[i].filterSearch = false
      columns[i].filters = undefined
    }
    return columns
  }
}


export class filterAndSortColumn<RecordType> implements ColumnType<RecordType>
{
  constructor(
    //Обязательный уникльный идентификатор колонки
    public uniqKey: string,
    public fieldName: keyof RecordType, public fieldType: 'string' | 'number' | 'boolean',
    public title: string,
  ) { }

  dataIndex?: DataIndex | undefined = this.fieldName as string
  key?: Key | undefined = this.uniqKey

  filterMode?: 'menu' | 'tree' | undefined = 'tree'

  filterSearch = true
  onFilter?: ((value: React.Key | boolean, record: RecordType) => boolean) | undefined =
    (value, record) => {
      const r = record as any
      return String(r[this.fieldName]).includes(String(value))
    }

  filterDropdown: React.ReactNode | ((props: FilterDropdownProps) => React.ReactNode) =
    ({ selectedKeys, setSelectedKeys, confirm, clearFilters }) => {
      const handleInputChange = (e: any) => {
        const value = e.target.value;
        setSelectedKeys(value ? [value] : []);
      };

      const handleConfirmClick = () => {
        confirm();
      };
      const handleResetClick = () => {
        if (clearFilters && typeof clearFilters === 'function') {
          clearFilters();
          confirm && confirm();
        }
      };

      return (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={handleInputChange}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleResetClick}>Reset</Button>
            <Button type="primary" onClick={handleConfirmClick}>
              OK
            </Button>
          </div>
        </div >
      );
    }

  width: string | number | undefined = 120
  sorter = (a: any, b: any) => {
    if (this.fieldType === 'number') return a[this.fieldName] - b[this.fieldName]
    else if (this.fieldType === 'string') return a[this.fieldName].localeCompare(b[this.fieldName])
  }
  defaultSortOrder?: SortOrder | undefined = 'ascend';
}

export class filterAndSortBoolColumn<RecordType> implements ColumnType<RecordType> {
  constructor(
    //Обязательный уникльный идентификатор колонки
    public uniqKey: string,
    public fieldName: keyof RecordType,
    public fieldType: 'boolean' = 'boolean',
    public trueText: string,
    public falseText: string,
    ) { }

  key?: Key | undefined = this.uniqKey
  dataIndex?: DataIndex | undefined = this.fieldName as string
  filterMode?: 'menu' | 'tree' | undefined = 'tree'
  filterSearch = true
  onFilter?: ((value: React.Key | boolean, record: RecordType) => boolean) = (value, record) => {
    if (value === this.trueText) {
      return record[this.fieldName] === true;
    }
    if (value === this.falseText) {
      return record[this.fieldName] === false;
    }
    return true;
  }

  width: string | number | undefined = 100
  sorter = (a: any, b: any) => {
    return a[this.fieldName] - b[this.fieldName]
  }

  defaultSortOrder?: SortOrder | undefined = 'ascend';

  filters?: ColumnFilterItem[] | undefined = [
    { text: this.trueText, value: this.trueText },
    { text: this.falseText, value: this.falseText },
  ]
}
