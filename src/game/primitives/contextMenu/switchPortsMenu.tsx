import React from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { DotFilledIcon, CheckIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { EventBus } from '@/game/EventBus';
import './styles.css';

interface SwitchPortMenuProps {
  style?: React.CSSProperties;
}

import { FC } from 'react';

const SwitchPortMenu: FC<SwitchPortMenuProps> = ({ style }) => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState('pedro');

  const cancel = () => {
    EventBus.emit('cancelDisplayPorts');
  }

  const handlePortClick = (port: string) => {
    EventBus.emit('selectedSwitchPort', port);
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="ContextMenuTrigger" style={style}></ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="ContextMenuContent">
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon /> FastEthernet <div className="RightSlot">0/1</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon /> FastEthernet <div className="RightSlot">0/2</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon />FastEthernet <div className="RightSlot">0/3</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon /> FastEthernet <div className="RightSlot">0/4</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon />FastEthernet <div className="RightSlot">0/5</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon />FastEthernet <div className="RightSlot">0/6</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon /> FastEthernet <div className="RightSlot">0/7</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon />FastEthernet <div className="RightSlot">0/8</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon /> FastEthernet <div className="RightSlot">0/9</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon /> FastEthernet <div className="RightSlot">0/10</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon />FastEthernet <div className="RightSlot">0/11</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon />FastEthernet <div className="RightSlot">0/12</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon /> FastEthernet <div className="RightSlot">0/13</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon />FastEthernet <div className="RightSlot">0/14</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon /> FastEthernet <div className="RightSlot">0/15</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon />FastEthernet <div className="RightSlot">0/16</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          <DotFilledIcon />FastEthernet <div className="RightSlot">0/17</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          GigabitEthernet <div className="RightSlot">0/1</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
          GigabitEthernet <div className="RightSlot">0/2</div>
          </ContextMenu.Item>



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