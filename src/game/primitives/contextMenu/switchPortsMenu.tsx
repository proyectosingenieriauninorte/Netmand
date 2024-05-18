import React from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { DotFilledIcon } from '@radix-ui/react-icons';
import { EventBus } from '@/game/EventBus';
import './styles.css';

interface SwitchPortMenuProps {
  style?: React.CSSProperties;
}

import { FC } from 'react';

const SwitchPortMenu: FC<SwitchPortMenuProps> = ({ style }) => {
  const cancel = () => {
    EventBus.emit('cancelDisplayPorts');
  };

  const handlePortClick = (port: string) => {
    EventBus.emit('selectedSwitchPort', port);
    cancel();
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="ContextMenuTrigger" style={style}></ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="ContextMenuContent">
          {Array.from({ length: 18 }, (_, i) => (
            <ContextMenu.Item key={i} className="ContextMenuItem" onClick={() => handlePortClick(`FastEthernet 0/${i + 1}`)}>
              <DotFilledIcon /> FastEthernet <div className="RightSlot">0/{i + 1}</div>
            </ContextMenu.Item>
          ))}
          {Array.from({ length: 2 }, (_, i) => (
            <ContextMenu.Item key={i + 18} className="ContextMenuItem" onClick={() => handlePortClick(`GigabitEthernet 0/${i + 1}`)}>
              <DotFilledIcon /> GigabitEthernet <div className="RightSlot">0/{i + 1}</div>
            </ContextMenu.Item>
          ))}

          <ContextMenu.Separator className="ContextMenuSeparator" />

          <ContextMenu.Item className="ContextMenuItem" onClick={cancel}>
            Cancelar <div className="RightSlot">X</div>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export default SwitchPortMenu;
