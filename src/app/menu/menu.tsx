import React from 'react';
import * as Menubar from '@radix-ui/react-menubar';
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from '@radix-ui/react-icons';
import './styles.css';
import { FC, forwardRef } from 'react';
import { EventBus } from '@/canvas/EventBus';

const RADIO_ITEMS = ['Andy', 'Benoît', 'Luis'];
const CHECK_ITEMS = ['Always Show Bookmarks Bar', 'Always Show Full URLs'];

interface menuProps {
    style?: React.CSSProperties;
}

const MenubarDemo: FC<menuProps> = forwardRef((_, ref) => {

  const handleSave = () => {
    EventBus.emit('saveWork');
  }

  const BackToMenu = () => {
    EventBus.emit('saveWork');
    window.location.href = '/user'
  }
  
  return (
    <Menubar.Root className="MenubarRoot">
      <Menubar.Menu>
        <Menubar.Trigger className="MenubarTrigger">File</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className="MenubarContent" align="start" sideOffset={5} alignOffset={-3}>
            <Menubar.Item className="MenubarItem" onClick={BackToMenu}>
              Back To Menu <div className="RightSlot"></div>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger className="MenubarTrigger">Edit</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className="MenubarContent" align="start" sideOffset={5} alignOffset={-3}>
            <Menubar.Item className="MenubarItem" onClick={handleSave}>
              Save <div className="RightSlot">crt + s</div>
            </Menubar.Item>
            
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
});

export default MenubarDemo;