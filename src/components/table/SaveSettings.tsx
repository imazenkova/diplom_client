import React, { useContext } from 'react';
import { ContextType } from '../../Reduser';
import { Modal } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { Upload, Button } from 'antd';
import { AppContext } from '../../AppContext';

interface SaveSettingsProps {
  visible: boolean;
  handleExportSettings: () => any;
  handleImportSettings: (file: File) => void;
  fileName: string;
  onCancel: () => void;
}
const SaveSettings: React.FC<SaveSettingsProps> = ({
  visible,
  handleExportSettings,
  handleImportSettings,
  fileName,
  onCancel,
}) => {
  const { state } = useContext<ContextType>(AppContext);
  return (
    <Modal
      title={state!.l.saveSettings.modalTitle}
      open={visible}
      onCancel={onCancel}
    >

      <Button onClick={handleExportSettings} icon={<DownloadOutlined />}>
        {state!.l.saveSettings.exportSettings}
      </Button>

      <Upload
        accept=".json"
        beforeUpload={(file) => {
          handleImportSettings(file);
          return false;
        }}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>{state!.l.saveSettings.uploadSettings}</Button>
      </Upload>
    </Modal>
  );
};

export default SaveSettings;
