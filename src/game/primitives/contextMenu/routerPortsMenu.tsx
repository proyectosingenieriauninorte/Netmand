import React, { useEffect, useState, FC } from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { DotFilledIcon } from '@radix-ui/react-icons';
import { EventBus } from '@/game/EventBus';
import './styles.css';

interface RouterPortMenuProps {
  style?: React.CSSProperties;
}

const RouterPortMenu: FC<RouterPortMenuProps> = ({ style }) => {
  const [menuCoordinates, setMenuCoordinates] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
    id: number;
    ports: { object: any, vlan: string }[];
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    type: '',
    id: 0,
    ports: []
  });

  const [contextMenuTrigger, setContextMenuTrigger] = useState<HTMLDivElement | null>(null);

  const hidePorts = () => {
    const menu = document.getElementById('routerPorts');
    if (menu) {
      menu.style.display = 'none';
    }
  };

  useEffect(() => {
    const showPorts = (data: {
      x: number;
      y: number;
      width: number;
      height: number;
      type: string;
      id: number;
      ports: { object: any, vlan: string }[];
      clientX: number;
      clientY: number;
    }) => {
      const menu = document.getElementById('routerPorts');
      if (menu) {
        menu.style.left = `${data.x}px`;
        menu.style.top = `${data.y}px`;
        menu.style.width = `${data.width}px`;
        menu.style.height = `${data.height}px`;
        menu.style.display = 'block';
      }
      setMenuCoordinates(data);

      // Programmatically trigger the context menu
      if (contextMenuTrigger) {
        const event = new MouseEvent('contextmenu', { bubbles: true, clientX: data.clientX, clientY: data.clientY });
        contextMenuTrigger.dispatchEvent(event);
      }
    };

    EventBus.on('displayRouterPorts', showPorts);
    EventBus.on('hideRouterPorts', hidePorts);

    window.addEventListener('click', (e) => {
      if (e.target !== document.getElementById('routerPorts')) {
        hidePorts();
      }
    });

    return () => {
      EventBus.off('displayRouterPorts', showPorts);
      EventBus.off('hideRouterPorts', hidePorts);
      window.removeEventListener('click', (e) => {
        if (e.target !== document.getElementById('routerPorts')) {
          hidePorts();
        }
      });
    };
  }, [contextMenuTrigger]);

  const cancel = () => {
    EventBus.emit('cancelDisplayRouterPorts');
  }

  return (
    <div id="routerPorts" style={{ display: 'none', position: 'absolute'}}>
      <ContextMenu.Root>
        <ContextMenu.Trigger
          className="ContextMenuTrigger"
          style={style}
          ref={(instance: HTMLDivElement | null) => setContextMenuTrigger(instance)}
        ></ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className="ContextMenuContent">
            {menuCoordinates.ports.map((port, index) => (
              port === null && (
                <ContextMenu.Item key={index} className="ContextMenuItem">
                  <DotFilledIcon className="mr-2 h-4 w-4" />
                  FastEthernet <div className="RightSlot">0/{index + 1}</div>
                </ContextMenu.Item>
              )
            ))}
            <ContextMenu.Separator className="ContextMenuSeparator" />
            <ContextMenu.Item className="ContextMenuItem" onClick={cancel}>
              Cancelar <div className="RightSlot">X</div>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </div>
  );
};

export default RouterPortMenu;
