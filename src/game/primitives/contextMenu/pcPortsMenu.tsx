import React, { useEffect, useState, FC } from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { EraserIcon, CheckIcon } from '@radix-ui/react-icons';
import { EventBus } from '@/game/EventBus';
import './styles.css';

interface PcPortMenuProps {
  style?: React.CSSProperties;
}

const PcPortMenu: FC<PcPortMenuProps> = ({ style }) => {
  const [menuCoordinates, setMenuCoordinates] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
    id: number;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    type: '',
    id: 0
  });

  const [contextMenuTrigger, setContextMenuTrigger] = useState<HTMLDivElement | null>(null);

  const hidePorts = () => {
    const menu = document.getElementById('pcPorts');
    if (menu) {
      menu.style.display = 'none';
    }
  };

  const adjustCoordinates = (x: number, y: number, menuWidth: number, menuHeight: number) => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return { x, y };

    const canvasRect = canvas.getBoundingClientRect();

    // Adjust coordinates if the menu goes out of bounds
    if (x + menuWidth > canvasRect.right) {
      x = canvasRect.right - menuWidth;
    }
    if (y + menuHeight > canvasRect.bottom) {
      y = canvasRect.bottom - menuHeight;
    }

    // Ensure menu doesn't go above or to the left of the canvas
    if (x < canvasRect.left) {
      x = canvasRect.left;
    }
    if (y < canvasRect.top) {
      y = canvasRect.top;
    }

    return { x, y };
  };

  useEffect(() => {
    const showPorts = (data: {
      x: number;
      y: number;
      width: number;
      height: number;
      type: string;
      id: number;
      clientX: number;
      clientY: number;
    }) => {
      const menu = document.getElementById('pcPorts');
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
        const { x, y } = adjustCoordinates(data.clientX, data.clientY, data.width, data.height);
        const event = new MouseEvent('contextmenu', { bubbles: true, clientX: x, clientY: y});
        contextMenuTrigger.dispatchEvent(event);
      }
    };

    EventBus.on('showPcPorts', showPorts);
    EventBus.on('hidePcPorts', hidePorts);

    window.addEventListener('click', (e) => {
      if (e.target !== document.getElementById('pcPorts')) {
        hidePorts();
      }
    });

    return () => {
      EventBus.off('showPcPorts', showPorts);
      EventBus.off('hidePcPorts', hidePorts);
      window.removeEventListener('click', (e) => {
        if (e.target !== document.getElementById('pcPorts')) {
          hidePorts();
        }
      });
    };
  }, [menuCoordinates, contextMenuTrigger]);

  return (
    <div id="pcPorts" style={{display: 'none', position: 'absolute'}}>
      <ContextMenu.Root>
        <ContextMenu.Trigger 
          className="ContextMenuTrigger"
          style={style}
          ref={(instance: HTMLDivElement | null) => setContextMenuTrigger(instance)}
        ></ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className="ContextMenuContent">
            <ContextMenu.Item className="ContextMenuItem">
              <CheckIcon className="mr-2 h-4 w-4" />
              FastEthernet <div className="RightSlot">0/1</div>
            </ContextMenu.Item>
            <ContextMenu.Separator className="ContextMenuSeparator" />
            <ContextMenu.Item className="ContextMenuItem">
              <EraserIcon className="mr-2 h-4 w-4" />
              Cancelar <div className="RightSlot">X</div>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </div>
  );
};

export default PcPortMenu;
