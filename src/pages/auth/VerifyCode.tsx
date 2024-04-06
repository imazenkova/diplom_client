import { Input, Modal, message } from 'antd';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { ApiError } from '../../shared.lib/api/errors';

interface VerifyCodeProps {
  visible: boolean;
  codeToken: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const VerifyCode: React.FC<VerifyCodeProps> = ({ visible, codeToken, onCancel, onSuccess }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [code, setCode] = useState('');
  const { state } = useContext<ContextType>(AppContext)
const [isLoading,setLoading]=useState(false)
  const handleOk = async () => {
    try {
      setLoading(true)
      // const result = await AuthApi.verifySecurityCode({
      //   token: codeToken,
      //   code
      // });
      onSuccess();
    } catch (e) {
      const ae = ApiError.FromAxios(e)
      if(ae.aexCode === 'auth.codeNotEq'){
        message.error(`${state?.l.errors.codeNotEq}`);
      }
      //console.error(e);
    }finally{
      setLoading(false)
    }
  };

  return (
    <Modal
      title={state?.l?.verifyCode.title}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Input placeholder={state?.l?.verifyCode.code}  disabled={isLoading}onChange={(event) => setCode(event.target.value)} />
    </Modal>
  );
};
