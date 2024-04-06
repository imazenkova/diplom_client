import { DeleteOutlined, DiffOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Table } from "antd";
import { ColumnsType } from 'antd/lib/table';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { ResourceApi } from "../../api/resource.api.cli";
import { AppSettig } from '../../app.setting';
import { buttonLeftIcon } from "../../components/layout/AppHeader.style";
import { useHeaderMenu } from '../../hooks/useMenu';
import { IItemResource, IItemTypeResource, TypeResource } from "../../shared.lib/api/resource.api";

const PriceComparatorTemplate: React.FC = () => {
  const type: TypeResource = "PricesTemplate"
  const [data, setData] = useState<{ name: string; key: string; }[]>([]);
  const { state } = useContext<ContextType>(AppContext);

  useHeaderMenu({
    items: [{
      key: 'id_1', val: <>
        {<Button
          type="text"
          htmlType="submit"
          onClick={() => { navigate("/pricecomparator/template/create") }}
        >
          <DiffOutlined style={buttonLeftIcon} />{" "} {state?.l.priceCmp.newTemp}</Button>}
      </>
    }]
  })

  const loadResourceData = async () => {
    try {
      const resourcePayload: IItemTypeResource = {
        type: type,
        respValue: true,
      };
      let res = await ResourceApi.loadList(resourcePayload);
      res = res.map((item: any) => {
        if (item.name.endsWith('.json')) {
          item.name = item.name.slice(0, -5); // убираем  (.json) из имени
        }
        return item;
      });
      setData(res.map(v => { return { name: v.name, key: v.name } }));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteResourseDB = async (fileName: string) => {
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
      await loadResourceData();
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate()
  const columns: ColumnsType<any> = [
    { title: `${state!.l.comparePrice.template.name}`, dataIndex: 'name', width: '30%' },
    {
      title: `${state!.l.comparePrice.template.edit}`, dataIndex: 'edit', key: 'change', width: '30%',
      render: (state: number, row: any) =>
        <Button type='text'
          onClick={() => { navigate(`${AppSettig.routePath.templateEdit}?fileName=${row.name}`) }}>
          <EditOutlined />
        </Button>
    },
    {
      title: `${state!.l.comparePrice.template.delete}`, dataIndex: 'delete',
      render: (state: number, record: any) => (
        <Button type='text' onClick={() => {
          deleteResourseDB(record.name);
        }}>
          <DeleteOutlined />
        </Button>
      ),
    },

  ];
  useEffect(() => {
    loadResourceData();
  }, []);

  return (
    <>

      <Table columns={columns} size='large' style={{ height: '100%' }}
        dataSource={data}
      />
    </>)
}

export default PriceComparatorTemplate;
