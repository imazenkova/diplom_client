import { App } from "antd";
import { IItemResource, IItemTypeResource, IResource, TypeResource } from "../../shared.lib/api/resource.api";
import { IFilter } from "../../shared.lib/filter-and-sort/filter";
import FilterDrop from "./FilterDrop";
import { SettingItem } from "./TabConfig";
import { ASINColumns } from "./asin-table-columns";
import { Translation } from "../../locales/lang";
import { ResourceApi } from "../../api/resource.api.cli";
import { ApiError } from "../../shared.lib/api/errors";

export interface IResourceTabView extends IResource {
  value: {
    columns: SettingItem[];
    rules: IFilter<any>;
  }
}

export function useTabResource(loc: Translation) {
  const { message } = App.useApp()

  const save = async (fileName: string, type: TypeResource, columns: ASINColumns, rulesToSave: IFilter<any>, checkedColumns: string[]) => {
    try {
      if (!fileName) {
        return; // Поле пустое, не выполняем сохранение
      }
      let updatedFileName = fileName.trim();

      if (!updatedFileName.endsWith(".json")) {
        updatedFileName += ".json";
      }
      //только колонки, которые выбраны пользователем
      const newColumns = columns.filter((column) => checkedColumns.includes(column.field as string)).map(column => {
        const val: SettingItem = {
          field: column.field as string,
          width: column.width as number
        }
        return val
      });

      if (!FilterDrop.isEmptyFilter(rulesToSave)) {
        const hasEmptyFields = rulesToSave.every((rule, index) => {
          const errorState = FilterDrop.getErrorState(rule.item);
          if (errorState !== "none") {
            return false;
          }
          return true;
        });

        if (!hasEmptyFields) {
          message.error(loc.view.checkFilter);
          throw Error(loc.view.checkFilter)
        }
      }

      const saveData: IResourceTabView = {
        name: updatedFileName,
        type: type,
        value: {
          columns: newColumns,
          rules: rulesToSave
        }
      }
      await ResourceApi.save(saveData);

    } catch (error) {
      console.log(ApiError.From(error).getFullMessage(', '))
    }
  }

  const load = async (type: TypeResource): Promise<IResourceTabView[]> => {
    try {
      const resourcePayload: IItemTypeResource = {
        type: type,
        respValue: true,
      };
      let res: IResourceTabView[] = await ResourceApi.loadList(resourcePayload);
      return res
    } catch (error) {
      console.log(ApiError.From(error).getFullMessage(', '))
    }
    return []
  }

  const del = async (fileName: string, type: TypeResource) => {
    try {
      let updatedFileName = fileName;
      if (!updatedFileName.endsWith(".json")) {
        updatedFileName += ".json";
      }

      const resourcePayload: IItemResource[] = [{
        name: updatedFileName,
        type: type,
      }];

      await ResourceApi.delete(resourcePayload);
    } catch (error) {
      console.log(ApiError.From(error).getFullMessage(', '))
    }
  };

  return { save, load, del }
}

