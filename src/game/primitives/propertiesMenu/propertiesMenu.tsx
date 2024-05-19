import { FC, useEffect, useState } from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { EventBus } from '@/game/EventBus';
import './styles.css';
import { Settings, EraserIcon } from 'lucide-react';

interface PropertiesMenuProps {
  style?: React.CSSProperties;
}

const PropertiesMenu: FC<PropertiesMenuProps> = ({ style }) => {

  const hideMenu = () => {
    const menu = document.getElementById('comp-properties');
    if (menu) {
      menu.style.display = 'none';
    }
  };

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

  useEffect(() => {
    const showMenu = (data: {
      x: number;
      y: number;
      width: number;
      height: number;
      type: string;
      id: number;
    }) => {
      const menu = document.getElementById('comp-properties');
      if (menu) {
        menu.style.left = `${data.x}px`;
        menu.style.top = `${data.y}px`;
        menu.style.width = `${data.width}px`; 
        menu.style.height = `${data.height}px`; 
        menu.style.display = 'block';
      }
      setMenuCoordinates(data);
    };

    
    EventBus.on('showPropertiesMenu', showMenu);
    EventBus.on('hidePropertiesMenu', hideMenu);

    window.addEventListener('click', (e) => {
      if (e.target !== document.getElementById('comp-properties')) {
        hideMenu();
      }
    });

    return () => {
      EventBus.off('showPropertiesMenu', showMenu);
      EventBus.off('hidePropertiesMenu', hideMenu);
      window.removeEventListener('click', (e) => {
        if (e.target !== document.getElementById('comp-properties')) {
          hideMenu();
        }
      });
    };
  }, [menuCoordinates]);

  const handleDelete = () => {
    EventBus.emit('deleteComponent', {x: menuCoordinates.x, y: menuCoordinates.y, obj: menuCoordinates.type, id: menuCoordinates.id});
    hideMenu();
  };

  return (
    <div id="comp-properties" style={{ position: 'absolute', display: 'none' }}>
      <ContextMenu.Root>
        <ContextMenu.Trigger className="ContextMenuTrigger" style={style}></ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className="ContextMenuContent">
            <ContextMenu.Item className="ContextMenuItem">
              <Settings className="mr-2 h-4 w-4" />
              Settings <div className="RightSlot"></div>
            </ContextMenu.Item>

            <ContextMenu.Separator className="ContextMenuSeparator" />

            <ContextMenu.Item className="ContextMenuItem" onClick={handleDelete}>
            <EraserIcon className="mr-2 h-4 w-4" />
              Delete <div className="RightSlot"></div>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </div>
  );
};

export default PropertiesMenu;
