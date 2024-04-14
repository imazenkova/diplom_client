import { CopyOutlined, EyeOutlined } from '@ant-design/icons';
import { App, Button } from 'antd';
import { GlobalState } from '../../Reduser';

export const formatObj  = (obj: any, app: typeof App.useApp,state:GlobalState) => {
  let str = JSON.stringify(obj, null, 2);
  const maxLength = 50;
  let displayText = str;
  let isTooLong = false;
  const { notification, modal } = app();

  if (str.length > maxLength) {
    displayText = str.slice(0, maxLength) + '...';
    isTooLong = true;
  }

  const showModal = (content: string) => {
    modal.success({
      title: `${state!.l.formatObject.fullText}`,
      content: <pre>{content}</pre>,
      width:'60%'
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(str);
      notification.success({
        message: `${state!.l.formatObject.success}`,
        description: `${state!.l.formatObject.succTextCopied}`
      });
    } catch (err) {
      notification.error({
        message: `${state!.l.formatObject.error}`,
        description: `${state!.l.formatObject.errorTextCopied}`
      });
    }
  }

  return (
    <div>
      <pre style={{ maxWidth: '20rem', overflow: 'hidden', textOverflow: 'ellipsis',  }}>
        {displayText}
      </pre>

      {isTooLong && (
        <>
          <Button type="link" icon={<EyeOutlined />} onClick={() => showModal(str)} />
          <Button type="link" icon={<CopyOutlined />} onClick={copyToClipboard} />
        </>
      )}
    </div>
  )
}
