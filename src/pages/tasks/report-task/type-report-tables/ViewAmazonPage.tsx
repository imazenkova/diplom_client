import { Tabs } from 'antd';
import React, { useRef, useMemo } from 'react';
import ASINTable from '../../../../components/table/asin-table/ASINTable';
import { mainContentBorder } from '../../../../styles/app.styles';
import { ViewResultTableProps } from './ViewResultTable';
import { pageAmzColumns, pageAmzSellerColumns } from './columns-info/page-amz-columns';
import { AmzPage, AmzSeller } from '../../../../shared.lib/plugins/amz-types';

export type ViewAmazonPageTableProps = Omit<ViewResultTableProps, 'resource' | 'columns' | 'addButtonsComponent'>;

const ViewAmazonPage: React.FC<ViewAmazonPageTableProps> = (props) => {
  const { data, onSave } = props
  const dataSource = useRef(data.resultData)

  const sellerData = useMemo(() => {
    if (!data.resultData) return []
    const map = new Map<string, AmzSeller>()
    for (let i = 0; i < data.resultData.length; i++) {
      const c = data.resultData[i] as AmzPage
      if (!c.sellersInfo) continue

      for (let n = 0; n < c.sellersInfo.length; n++) {
        map.set(c.sellersInfo[n].sellerId, c.sellersInfo[n])
      }
    }

    return Array.from(map.values())
  }, [data.resultData])

  const tabItems = [
    {
      key: '1',
      label: 'Listings',
      style: { height: '100%' },
      children:
        <ASINTable
          resource={'AmzTable/Pages'}
          baseTable={{
            name: data.name,
            dataSource: data.resultData!,
            columns: pageAmzColumns,
          }}
          onChangeDataSource={(ds) => dataSource.current = ds}
          onSave={onSave ? async (dataSourceNew) => onSave(data, dataSourceNew) : undefined}
          useMain={false}
        />
    },
    // {
    //   key: '2',
    //   label: 'Sellers',
    //   style: { height: '100%' },
    //   children:
    //     <ASINTable
    //       resource={'AmzTable/Sellers'}
    //       baseTable={{
    //         name: data.name,
    //         dataSource: sellerData,
    //         columns: pageAmzSellerColumns,
    //       }}
    //       onChangeDataSource={(ds) => { }}
    //       useMain={false}
    //     />

    // },
    //{ key: '3', label: 'Analisys', children: <div style={{ height: '100%', display: 'flex' }} id='dddd1'>Content of Tab ZZZ<br /><br /></div> },
  ]

  return (
    <>
      <Tabs
        destroyInactiveTabPane={true}
        style={{
          height: 'calc(100%)',
          ...mainContentBorder
        }}
        tabBarStyle={{ padding: '0 0.5rem 0  0.5rem', }}
        size={'small'}
        tabPosition={'bottom'}
        items={tabItems}
      />
    </>
  );
};

export default ViewAmazonPage;
