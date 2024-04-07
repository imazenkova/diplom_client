
import { Modal } from 'antd'
import { CookiesKeys } from "../../types/cookies-keys";
import { Cookies } from 'react-cookie';

const BlockedAccountPopup = () => {
  const cookies = new Cookies()

  const handleLogout =() => {
    console.log("close")
    cookies.remove(CookiesKeys.access, { path: '/' })
   window.location.reload();
  }

  return (
    <Modal
      open={true}
      title="Заблокированный аккаунт"
      footer={null}
      onCancel={handleLogout}
   
    >
      <p>Ваш аккаунт был заблокирован. Пожалуйста, свяжитесь с администратором для получения дополнительной информации.</p>
    </Modal>
  );
};

export default BlockedAccountPopup;