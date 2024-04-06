import { GlobalState } from "../../Reduser";
import { IComparePricesColumns } from "../../shared.lib/api/task.data";
import { colCenterCss } from "../../styles/grid.styles";
import { DataItem, selectItem } from "./template.types";
import { Mentions, Select } from 'antd';

export const customSelectFormatter = (compare: keyof IComparePricesColumns, row: DataItem, setData: React.Dispatch<React.SetStateAction<DataItem[]>>, data: DataItem[], uploadObjectKeys: any) => {
  const selectRow = data.find(item => item.compare === row.compare);
  if (!selectRow) throw new Error(`Not find: ${row.compare}`)

  const handleSelectChange = (value: string) => {
    selectRow.upload = value
    setData([...data])
  };

  let selectArray = uploadObjectKeys.map((column: string) => {
    return { label: column, value: column };
  });

  const selectWithformula = [
    { label: <><div style={{ paddingBottom: "0.5rem" }}>@formula</div></>, value: "formula" },
    ...uploadObjectKeys.map((column: string) => ({
      label: column,
      value: column,
    })),
  ];

  const handleMultiSelectChange = (value: string[]) => {
    selectRow.upload = value
    console.info('handleMultiSelectChange', selectRow)
    setData([...data])
  };

  const selectComponent = (
    <div style={{ ...colCenterCss, width: "100%" }}>
      <Select
        showSearch
        value={selectRow.upload as string}
        style={{ width: "100% " }}
        onChange={handleSelectChange}
      >
        {selectWithformula.map((option: selectItem) => (
          <Select.Option key={option.value} value={option.value} style={option.value === "formula" ? {} : {}}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </div>
  );

  const multiSelectComponent = (
    <div style={{ ...colCenterCss, width: "100%" }}>
      <Select
        showSearch
        mode="multiple"
        value={selectRow.upload as string[]}
        style={{ width: "100% " }}
        onChange={handleMultiSelectChange}
      >
        {selectArray.map((option: selectItem) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </div>
  );

  return compare === "attr" ? multiSelectComponent : selectComponent;
};

export const customMentionFormatter = (compare: string, row: DataItem, setData: React.Dispatch<React.SetStateAction<DataItem[]>>, data: DataItem[], uploadObjectKeys: any,state:GlobalState) => {
  const combinedKeys = uploadObjectKeys.map((key: string) => ({
    label: key,
    value: `(${key})`,
  }));

  const uploadValue = row.upload;
  const isDisabled = uploadValue !== "formula";

  const onChange = (value: string) => {
    const editableFormula = uploadValue === "formula";
    // Обновляем значение в поле upload, если выбрано "formula"
    if (editableFormula) {
      setData((prevData: DataItem[]) =>
        prevData.map((item: DataItem) => {
          if (item.compare === row.compare) {
            return {
              ...item,
              formula: value
            };
          }
          return item;
        })
      );
    }
  };
  const selectRow = data.find(item => item.compare === row.compare);
  const mention = selectRow!.formula;

  const mentionsComponent = (
    <Mentions
      autoSize
      disabled={isDisabled}
      placeholder={isDisabled ? "" : `${state!.l.resourceTemplate.formatters.useAT}`}
      value={mention}
      style={{ width: '100%' }}
      onChange={onChange}
      options={combinedKeys}
    />
  );

  return mentionsComponent;
};
