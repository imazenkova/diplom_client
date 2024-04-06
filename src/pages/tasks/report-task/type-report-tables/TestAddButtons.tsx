import { AppstoreAddOutlined } from '@ant-design/icons';
import { App, Button } from 'antd';
import { useContext } from 'react';
import { AppContext } from '../../../../AppContext';
import { ContextType } from '../../../../Reduser';

const TestAddButtons: React.FC = () => {
  const { modal } = App.useApp();
  const { state } = useContext<ContextType>(AppContext);
  return (
    <>
      <Button type="text" shape="round" icon={<AppstoreAddOutlined />} size='middle'
        onClick={() => { modal.info({title: `${state!.l.amazonEbayAddButtons.test}`}) }}>{state!.l.amazonEbayAddButtons.test}...</Button>
    </>
  );
};

export default TestAddButtons;
