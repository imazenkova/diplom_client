import { CheckOutlined, CloseCircleOutlined, CloseOutlined, FilterOutlined } from '@ant-design/icons';
import { Button, Col, Input, InputNumber, Row, Select, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { Constraints, FilterItemValue, FilterRow, Logic } from '../../shared.lib/filter-and-sort/filter';
import { colCenterCss } from '../../styles/grid.styles';
import { themeDef } from '../../styles/theme.app.def';
import { ASINColumns, DataType } from './asin-table-columns';
import { filterItem } from './asin-table/table.style';
const { Option } = Select;
const { Text } = Typography;

const supportFilterType: DataType[] = ['boolean', 'number', 'string', 'url']
const unSupportFilterType: DataType[] = ['imgs', 'serv', 'date'] //Временно исключили дату т.к. нет для нее обработчкик

interface FilterRuleProps {
  index: number;
  rule: any;
  columns: ASINColumns;
  isClear: boolean;
  errorState: "column" | "constraint" | "value" | "none";
  updateRule: (index: number, updatedRule: FilterRow<any>) => void;
  deleteRule: (index: number) => void;
}

const FilterRule: React.FC<FilterRuleProps> = ({
  index,
  rule,
  columns,
  errorState,
  isClear,
  updateRule,
  deleteRule
}) => {
  const { state } = useContext<ContextType>(AppContext);
  const transl = state?.l.filter;
  const constraints = Object.keys(Constraints)
    .filter(key => isNaN(Number(key)))
    .map(key => Constraints[key as keyof typeof Constraints]);

  const [constraint, setConstraint] = useState<Constraints | null>(null);
  const [value, setValue] = useState<string | number | boolean | undefined>(undefined);
  const [column, setColumn] = useState<string | null>(null);
  const [colType, setColType] = useState<DataType | undefined>(undefined);

  function convertToFilterItemValue(dataType: DataType): FilterItemValue | null {
    if (!supportFilterType.includes(dataType)) return null
    if (dataType === 'url') return 'string'
    return dataType
  }

  function getColumnType(columnDataType: DataType): DataType | undefined {
    const fcolumn = columns.filter(column => column.field === columnDataType && supportFilterType.includes(column.dataType));
    if (fcolumn.length > 1) {
      console.error('FilterRuleProps: is more then one', fcolumn)
    }
    else if (fcolumn.length === 0) {
      console.error('FilterRuleProps: is zero')
      return undefined
    }
    const [col] = fcolumn
    return convertToFilterItemValue(col.dataType)! as DataType
  }

  //для вывода ограничени для определенного типа колоно(числа, текст, булев)
  const typeofNameforConstraint = (type: FilterItemValue, constraint: Constraints): boolean => {
    if (type === "string" && constraint > 0 && constraint < 100) {
      return true
    } else if (type === "number" && constraint >= 100 && constraint < 200) {
      return true
    } else if (type === "boolean" && constraint >= 200 && constraint < 300) {
      return true
    } else return false
  };

  const handleLogicChange = (value: Logic) => {
    const newLogic = value;
    const newRule = { ...rule, logic: newLogic };
    updateRule(index, newRule);
  };

  const handleNameChange = (value: string) => {
    const newColumn = value;
    setColumn(newColumn);
    setConstraint(null)
    const newRule = { ...rule, item: { name: newColumn, constraints: Constraints.none, value: '' } };
    updateRule(index, newRule);
    //получаем тип колонки
    const columnType = getColumnType(value as DataType)
    setColType(columnType!)
  };

  const handleConstraintChange = (value: number) => {
    setConstraint(value);
    const newRule = { ...rule, item: { ...rule.item, constraints: value } };
    updateRule(index, newRule);
  };

  const handleSetValue = (newValue: string | number | boolean | undefined) => {
    setValue(newValue);
    const newRule = {
      ...rule,
      item: {
        ...rule.item,
        value: newValue,
      },
    };
    updateRule(index, newRule);
  };

  //очистка сброс фильтра
  useEffect(() => {
    if (isClear === true) {
      setConstraint(Constraints.none)
      setColumn(null)
      setValue(undefined)
    }
  }, [
    isClear
  ])

  // при обновлении правил обновлять компоненты,для отрисовки
  useEffect(() => {
    const columnType = getColumnType(rule.item.name)
    setColType(columnType!)
    setConstraint(rule.item.constraints)
    setColumn(rule.item.name)
    setValue(rule.item.value)
  }, [rule]);

  const constraintOptions = constraints.filter(constraint => {
    if ('name' in rule.item) {
      const columnType = getColumnType(rule.item.name);
      return columnType ? typeofNameforConstraint(columnType, constraint) : false;
    }
    return false;
  }).filter(key => key !== 0).map((constraint, index) => ({ label: transl?.constraints[constraint!], value: constraint }))

  const booleanOptions = [
    {
      value: true,
      label: <CheckOutlined />,
    },
    {
      value: false,
      label: <CloseOutlined />,
    }]

  return (
    <Row style={{ display: 'flex' }}>
      <Col span={24} style={{ ...colCenterCss, gap: "0.5rem" }}>
        {index === 0 && <div> <FilterOutlined /><Text style={{ paddingLeft: "1.2rem", marginRight: "0.5rem" }}>{transl?.logic[Logic.where]}</Text></div>}
        {index !== 0 && (
          <Select //Logic
            defaultValue={rule.logic}
            size='small'
            onClick={(e) => e.stopPropagation()}
            style={{ width: "4rem" }}
            allowClear
            onChange={(value) => handleLogicChange(value)}
          >
            {Object.entries(Logic)
              .filter(f => isNaN(Number(f[0]))) //enum, TypeScript создает обратные поэтому делаем так
              .filter(f => f[1] !== Logic.where)
              .map((keyval) => {
                return (
                  <Option key={keyval[1]} value={keyval[1]}>
                    {transl?.logic[keyval[1] as Logic]}
                  </Option>
                )
              })}
          </Select>
        )}
        <Select //Name col
          showSearch
          size="small"
          placeholder={transl?.column}
          onClick={(e) => e.stopPropagation()}
          style={filterItem}
          status={errorState === "column" ? "error" : ""}
          allowClear
          filterOption={(input, option) => {
            const label = (option?.children as any) as string ?? ''
            return label.toLowerCase().includes(input.toLowerCase())!
          }}
          value={column || undefined}
          onChange={(value) => handleNameChange(value)}>
          {columns.filter(
            (column) => !unSupportFilterType.includes(column.dataType)
          ).map((column, index) => (
            <Option key={index} value={column.field}>
              {column.title}
            </Option>
          ))}
        </Select>
        <Select //Constraints
          size="small"
          style={filterItem}
          placeholder={transl?.constrainButton}
          onClick={(e) => e.stopPropagation()}
          value={constraint === Constraints.none ? undefined : constraint}
          status={errorState === "constraint" ? "error" : ""}
          allowClear
          onChange={(value) => handleConstraintChange(value)}
          options={constraintOptions}
        >
        </Select>
        {colType === "boolean" && (
          <Select //Checkbox Value
            size="small"
            style={filterItem}
            placeholder={transl?.value}
            onClick={(e) => e.stopPropagation()}
            allowClear
            value={value}
            status={errorState === "value" ? "error" : ""}
            onChange={(value) => handleSetValue(value)}
            options={booleanOptions}
          />

        )}
        {!['number', 'boolean', 'date'].includes(colType as string) && (
          <Input //Value
            size="small"
            style={filterItem}
            type='text'
            maxLength={32}
            disabled={constraint === Constraints.strIsEmpty || constraint === Constraints.strIsNotEmpty ? true : false}
            status={errorState === "value" ? "error" : ""}
            placeholder={transl?.value}
            value={value as string}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(event) => {
              handleSetValue(event.target.value)
            }}
          />
        )}
        {colType === 'number' && (
          <InputNumber //Value
            size="small"
            style={filterItem}
            disabled={constraint === Constraints.numIsEven || constraint === Constraints.numIsOdd ? true : false}
            status={errorState === "value" ? "error" : ""}
            placeholder={`${' '}${transl?.value}`}
            maxLength={12}
            value={value as number}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(value) => {
              handleSetValue(value as number)
            }}
          />
        )}
        <Button
          type='text'
          disabled={index === 0}
          style={{ margin: "0px", padding: "0px", color: index === 0 ? themeDef.antd.colorTextDisabled : themeDef.antd.colorPrimaryBorder }}
          onClick={(e) => {
            e.stopPropagation(); deleteRule(index);
          }}
          icon={<CloseCircleOutlined style={{ fontSize: '1.25rem' }} />}
        >
        </Button>
      </Col>
    </Row>
  );
};

export default FilterRule;
