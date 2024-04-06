import type { UploadProps } from 'antd';
import { App, Upload } from 'antd';
import React from 'react';
import { getAuthHeader } from '../../api/config.axios';
import { AppSettig } from '../../app.setting';

interface FileUploaderProps extends UploadProps {
  onUploadSuccess?: (filename: string) => void;  // Callback после успешной загрузки файла
}

const FileUplader: React.FC<FileUploaderProps> = ({ onUploadSuccess, children, ...externalProps }) => {
  const { message } = App.useApp()

  const combinedProps: UploadProps = {
    name: 'file',
    action: AppSettig.getServUrl() + '/api/uploadFilesTask',
    headers: { ...getAuthHeader() },
    multiple: false,
    showUploadList: true,

    onChange(info) {
      if (info.file.status === 'removed') {
      }

      if (info.file.status === 'done') {
        const serverFilename = info.file.response.filename;
        message.success(`${info.file.name} file uploaded`);

        // Вызываем callback и передаем ему имя файла
        if (onUploadSuccess) {
          onUploadSuccess(serverFilename);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    ...externalProps,
  };

  return (
    <Upload {...combinedProps}>
      {children}
    </Upload>
  );
}

export default FileUplader;
