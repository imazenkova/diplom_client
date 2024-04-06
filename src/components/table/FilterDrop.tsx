import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { App, Button, Col, Dropdown, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { useDebugInformation } from '../../hooks/debug/useDebugInformation';
import { Constraints, Filter, FilterRow, IFilter, Logic } from '../../shared.lib/filter-and-sort/filter';
import { colLeftCss, colRightCss } from '../../styles/grid.styles';
import { themeDef } from '../../styles/theme.app.def';
import FilterRule from './FilterRule';
import { ASINColumns } from './asin-table-columns';
import { eqObj } from '../../hooks/eq-obj';

interface FilterProps {
  columns: ASINColumns
  newRules: IFilter<any>;
  onRulesChange?: (rules: IFilter<any>) => void;
}

export interface ConstraintsDescriptions {
  [key: number]: string | undefined;
}

type FilterDropType = React.FC<FilterProps> & {
  isEmptyFilter: (filter: IFilter<any>) => boolean;
  getErrorState(item: FilterRow<any>['item']): "column" | "constraint" | "value" | "none"
};

const FilterDrop: FilterDropType = (props) => {
  const { columns, onRulesChange } = props
  const initialFilter: IFilter<any> = [{
    logic: Logic.where,
    item: { name: '', constraints: Constraints.none, value: '' }
  }]
  const newRulesExternal = (!props.newRules || (props.newRules.length === 0)) ? initialFilter : props.newRules

  useDebugInformation('FilterDrop', props, true)

  const { state } = useContext<ContextType>(AppContext);
  const [rulesInternal, setRulesInternal] = useState<IFilter<any>>(initialFilter);
  const [rulesExternal, setRulesExternal] = useState<IFilter<any>>(newRulesExternal);


  const { message } = App.useApp()
  //Для подсчета и вывода количества используемых правил
  const [counter, setCounter] = useState(1);
  const [buttonName, setButtonName] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);//вывод количества првил на кнопке
  const [isClear, setIsClear] = useState(false);
  const transl = state?.l.filter;


  useEffect(() => {
    //значит изменили из вне
    if (!eqObj(newRulesExternal, rulesExternal)) {
      setRulesInternal(newRulesExternal);
      setRulesExternal(newRulesExternal);
    }

    updateButtonName(rulesInternal)
  }, [rulesInternal, rulesExternal, newRulesExternal])

  //добавить правило
  const addRule = () => {
    setRulesInternal([
      ...rulesInternal,
      {
        logic: Logic.and,
        item: { name: '', constraints: Constraints.none, value: '' },
      },
    ]);
    setCounter(counter + 1);
  };

  //проверка на пустые поля при фильтрации
  const [errorStates, setErrorStates] = useState<{ [index: number]: "column" | "constraint" | "value" | "none" }>(
    Object.fromEntries(rulesInternal.map((_, index) => [index, "none"]))
  );

  //передаем в компоненты, чтобы они обновляли правила в родительском по своему индексу
  const updateRule = (index: number, updatedRule: FilterRow<any>) => {
    const newRules = [...rulesInternal];
    newRules[index] = updatedRule;
    setRulesInternal(newRules);
  };

  const checkRulesThrow = (rules: IFilter<any>) => {
    // Проверяем каждый элемент массива rules на наличие необходимых свойств
    const hasEmptyFields = rules.every((rule: FilterRow<any>, index) => {
      if (Filter.isFilterItem(rule.item)) {
        const errorState = FilterDrop.getErrorState(rule.item);

        setErrorStates(prevStates => {
          const newStates = { ...prevStates };
          newStates[index] = errorState;
          return newStates;
        });

        if (errorState !== "none") {
          return false;
        }
      }

      return true;
    });

    if (!hasEmptyFields) {
      message.error(transl?.emptyRule);
      throw Error(transl?.emptyRule)
    }
  }

  const updateButtonName = (rules: IFilter<any>) => {
    if (FilterDrop.isEmptyFilter(rules)) {
      setIsFilterApplied(false)

    } else {
      setButtonName(`${rules.length} ${rules.length === 1 ? `${state?.l.filter.oneRule}` : `${state?.l.filter.manyRules}`}`)
      setIsFilterApplied(true);//для вывода количества примененных првил
    }
  }

  // фильтруем
  const applyFilter = (rules: IFilter<any>, e?: React.MouseEvent<HTMLElement, MouseEvent>,) => {
    try {
      checkRulesThrow(rules)
      updateButtonName(rules)
      if (onRulesChange) onRulesChange(rules)
    } catch (error) {
      e?.stopPropagation()
    }
  };

  //удалить одно правило
  const deleteRule = (index: number) => {
    const newRules = [...rulesInternal];
    newRules.splice(index, 1);
    setRulesInternal(newRules);
    setCounter(counter - 1);
  };

  //скинуть все правила
  const clearFilter = () => {
    setRulesInternal([
      {
        logic: Logic.where,
        item: {
          name: '',
          constraints: Constraints.none,
          value: '',
        },
      },
    ]);
    setCounter(1); // Устанавливаем счетчик в 1, так как теперь у нас только одно правило
    setIsFilterApplied(false); // Отменяем вывод количества првил на кнопке
    setIsClear(true) // Очищаем значения в селектах и инпутах
    if (onRulesChange) onRulesChange(initialFilter)
  };

  const items: MenuProps['items'] = [
    {
      key: '0', label: <div style={{ overflowY: "auto", maxHeight: '13rem' }}> {rulesInternal.map((rule, index) => (
        <FilterRule
          key={index}
          index={index}
          rule={rule}
          columns={columns}
          isClear={isClear}
          updateRule={updateRule}
          deleteRule={deleteRule}
          errorState={errorStates[index]}
        />
      ))}
      </div>
    },
    {
      key: "1", label: <>
        <Row style={{ display: 'flex' }}>
          <Col span={17} style={{ ...colLeftCss }}>
            <Button size='small' type='default' onClick={(e) => { e.stopPropagation(); addRule(); }}>
              {transl?.addRule}</Button>
          </Col>
          <Col span={7} style={{ ...colRightCss, gap: "0.5rem" }}>
            <Button size='small' type='primary' onClick={(e) => { applyFilter(rulesInternal, e) }}>
              {transl?.filtration}
            </Button>
            <Button size='small' type='default' onClick={(e) => {
              e.stopPropagation(); clearFilter();
            }} >
              {transl?.clear}
            </Button>
          </Col>
        </Row>
      </>
    }]

  return (
    <div>
      <Dropdown menu={{
        items
      }}
        trigger={['click']
        }
        arrow={{ pointAtCenter: true }}
        overlayStyle={{
          width: '33rem',
          right: '0', // Правое выравнивание меню
        }}
      >
        {isFilterApplied ? (
          <Button type='default' shape='round' size='small' style={{ fontWeight: 'bold', color: themeDef.antd.colorPrimaryActive }} >
            {buttonName}  <DownOutlined />
          </Button>
        ) : (
          <Button shape='round' size='small' type='default' >{transl?.name}</Button>
        )}
      </Dropdown>
    </div>
  );
};

FilterDrop.isEmptyFilter = (filter: IFilter<any>) => {
  if (!filter || filter.length === 0) return true
  if (filter.length === 1 && Filter.isFilterItem(filter[0].item)) {
    if (filter[0].item.name === '' &&
      (filter[0].item.constraints === Constraints.none ||
        filter[0].item.constraints === undefined)) return true
  }

  return false
}

FilterDrop.getErrorState = (item: FilterRow<any>['item']): "column" | "constraint" | "value" | "none" => {
  if (Filter.isFilterItem(item)) {
    if (item.name === '' || item.name === undefined) {
      return "column";
    }
    if (item.constraints === Constraints.none || item.constraints === undefined) {
      return "constraint";
    }
    if (
      (item.constraints !== Constraints.numIsEven && item.constraints !== Constraints.numIsOdd && item.constraints !== Constraints.strIsEmpty && item.constraints !== Constraints.strIsNotEmpty) &&
      (item.value === '' || item.value === undefined || item.value === null)
    ) {
      return "value";
    }
  }
  return "none";
}

export default FilterDrop
