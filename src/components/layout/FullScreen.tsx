import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { CSSProperties, useEffect, useState } from 'react';

interface FullscreenButtonProps {
  buttonStyle?: CSSProperties;
  buttonIcon?: CSSProperties;
  type?: "link" | "text" | "default" | "primary" | "dashed" | undefined;
  elem: HTMLDivElement | null;
  shape?: "default" | "circle" | "round" | undefined;
}

export interface FullscreenButtonRef {
  toggleFullscreen: () => void;
}
const FullscreenButton = React.forwardRef<FullscreenButtonRef, FullscreenButtonProps>((props, ref) => {
  const [isFullscreen, setFullscreen] = useState(false);

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      props.elem?.requestFullscreen().then(() => {
        setFullscreen(true);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setFullscreen(false);
        });
      }
    }
  };

  // Обработчик события изменения полноэкранного режима
  const handleFullscreenChange = () => {
    setFullscreen(!!document.fullscreenElement);
  };

  // Добавляем обработчик события при монтировании компонента
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Убираем обработчик при размонтировании компонента
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Button shape={props.shape} type={props.type} style={props.buttonStyle} onClick={handleFullscreenToggle}
      icon={isFullscreen ? <FullscreenExitOutlined style={props.buttonIcon} /> : <FullscreenOutlined style={props.buttonIcon} />}
    >

    </Button>
  );
});

export default FullscreenButton;
