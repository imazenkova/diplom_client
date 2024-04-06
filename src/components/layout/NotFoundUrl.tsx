import React, { useEffect ,useContext} from 'react';
import { Result, Button } from 'antd';
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';

const NotFoundUrl: React.FC = () => {
  const { state } = useContext<ContextType>(AppContext)
  useEffect(() => {
    setTimeout(() => {
      window.location.replace('/tasks');
    },10000);
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Result
        status="404"
        title="404"
        subTitle={state!.l.notFoundUrl.subTitle}
        extra={
          <Button type="primary" onClick={() => window.location.replace('/tasks')}>
           {state!.l.notFoundUrl.toPrimary}
          </Button>
        }
        style={{ animation: 'fade-in 0.5s ease-in-out' }}
      />
    </div>
  );
};

export default NotFoundUrl;
