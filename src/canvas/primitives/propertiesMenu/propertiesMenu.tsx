import { FC, useEffect, useState } from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { EventBus } from '@/canvas/EventBus';
import './styles.css';
import { Settings, EraserIcon, ChevronsRightLeft } from 'lucide-react';

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

  const [componentProps, setComponentProps] = useState<{
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
      setComponentProps(data);
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
  }, [componentProps]);

  const handleDelete = () => {
    EventBus.emit('deleteComponent', {x: componentProps.x, y: componentProps.y, obj: componentProps.type, id: componentProps.id});
    hideMenu();
  };

  const handleSettings = () => {
    console.log(componentProps);
    EventBus.emit('displayComponentProperties', {id: componentProps.id, type: componentProps.type});
  }

  const handleCommands = () => {
    EventBus.emit('showCommands', {id: componentProps.id, type: componentProps.type});
  }

  return (
    <div id="comp-properties" style={{ position: 'absolute', display: 'none' }}>
      <ContextMenu.Root>
        <ContextMenu.Trigger className="ContextMenuTrigger" style={style}></ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className="ContextMenuContent">
            <ContextMenu.Item className="ContextMenuItem" onClick={handleSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Settings <div className="RightSlot"></div>
            </ContextMenu.Item>
            <ContextMenu.Item className="ContextMenuItem" onClick={handleCommands}>
            <ChevronsRightLeft className="mr-2 h-4 w-4" />
              Commands <div className="RightSlot"></div>
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
