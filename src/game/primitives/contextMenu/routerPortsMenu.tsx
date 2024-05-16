import React from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { DotFilledIcon, CheckIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { EventBus } from '@/game/EventBus';
import './styles.css';

interface RouterPortMenuProps {
  style?: React.CSSProperties;
}

import { FC } from 'react';

const RouterPortMenu: FC<RouterPortMenuProps> = ({ style }) => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState('pedro');

  const cancel = () => {
    EventBus.emit('cancelDisplayPorts');
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="ContextMenuTrigger" style={style} ></ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="ContextMenuContent">
          <ContextMenu.Item className="ContextMenuItem" >
            FastEthernet <div className="RightSlot">0/1</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem" >
            FastEthernet <div className="RightSlot">0/2</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem" >
            FastEthernet <div className="RightSlot">0/3</div>
          </ContextMenu.Item>


          <ContextMenu.Separator className="ContextMenuSeparator" />

          <ContextMenu.Item className="ContextMenuItem" >
            Cancelar <div className="RightSlot">X</div>
          </ContextMenu.Item>


          
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export default RouterPortMenu;