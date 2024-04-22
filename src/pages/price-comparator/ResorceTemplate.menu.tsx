import { CheckSquareOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { buttonLeftIcon } from '../../components/layout/AppHeader.style';
import { AddMenuItem } from '../../components/layout/HeaderFooterContext';
import { Translation } from '../../locales/lang';
import { GlobalState } from '../../Reduser';

export const menuTemplate = (acceptFileDlg: string, loc: Translation, onViewResult: () => void, onViewSpl: () => void,
  setUploadedFile: (f: RcFile) => Promise<string | undefined>,
  templName: string, uploadedFileName: string, enableCheckBtn: boolean,
  handleFormSubmit: () => void, setFileName: (faileName: string) => void, state: GlobalState
): AddMenuItem[] => {
  return [
    {
      key: 'id_1', val: <div>
        <Upload
          accept={acceptFileDlg}
          showUploadList={false}
          beforeUpload={async (file) => {
            return await setUploadedFile(file);
          }}
        >
          <Button type="text" icon={<UploadOutlined style={buttonLeftIcon} />}>{loc.priceCmp.upload} </Button>
        </Upload>
      </div>
    },
    // {
    //   key: 'id_2', val: <div>
    //     <Button type='text' icon={<CheckSquareOutlined style={buttonLeftIcon} />}
    //       onClick={() => onViewSpl()}
    //       disabled={!uploadedFileName}
    //     >
    //       {state.l.resourceTemplate.menu.viewing}
    //     </Button>
    //   </div>
    // },
    {
      key: 'id_3', val: <div>
        <Button type='text' icon={<CheckSquareOutlined style={buttonLeftIcon} />}
          onClick={() => onViewResult()}
          disabled={!enableCheckBtn}
        >
           {state.l.resourceTemplate.menu.check}
        </Button>
      </div>
    },
    {
      key: 'id_4', val: <>
        <Button
          type="text"
          disabled={!enableCheckBtn || !(templName)}
          icon={<SaveOutlined style={buttonLeftIcon} />}
          onClick={handleFormSubmit}
        >
           {state.l.resourceTemplate.menu.save}
        </Button>
      </>
    },
  ]
}
