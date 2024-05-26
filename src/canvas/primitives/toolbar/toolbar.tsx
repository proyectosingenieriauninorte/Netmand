import React, { useState } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import { FC, forwardRef, useEffect } from 'react';
import { EventBus } from '@/canvas/EventBus';
import SliderDemo from '../slider/slider';
import * as Popover from '@radix-ui/react-popover';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import './styles.css';

interface ToolbarDemoProps {
  style?: React.CSSProperties;
}

const pcClicked = () => {
  EventBus.emit('addPc');
};

const switchClicked = () => {
  EventBus.emit('addSwitch');
}

const routerClicked = () => {
  EventBus.emit('addRouter');
}

const cableClicked = () => {
  EventBus.emit('addCable');
}

const showCommands = () => {
  EventBus.emit('showCommands');
}

const ToolbarDemo: FC<ToolbarDemoProps> = forwardRef((_, ref) => {

  useEffect(() => {
    return () => {
    };
  }, []);

  return (
    <div style={{ pointerEvents: 'auto', bottom: '2%',  left: '50%', transform: 'translateX(-50%)', position: 'absolute'}}>
      
      <Toolbar.Root className="ToolbarRoot" aria-label="Formatting options">
          
        <Toolbar.Button id="pc-btton" className="ToolbarButton pcButton" onClick={pcClicked}>
          <span className="ToolbarLabel">PC</span>
        </Toolbar.Button>
  
        <Toolbar.Separator className="ToolbarSeparator" />

        <Toolbar.Button id="switch-btton" className="ToolbarButton switchButton" onClick={switchClicked}>
          <span className="ToolbarLabel">Switch</span>
        </Toolbar.Button>

        <Toolbar.Separator className="ToolbarSeparator" />

        <Toolbar.Button id="router-btton" className="ToolbarButton routerButton" onClick={routerClicked}>
          <span className="ToolbarLabel">Router</span>
        </Toolbar.Button>

        <Toolbar.Separator className="ToolbarSeparator" />

        <Toolbar.Button id="cable-btton" className="ToolbarButton cableButton" onClick={cableClicked}>
          <span className="ToolbarLabel">Cable</span>
        </Toolbar.Button>

        <Toolbar.Separator className="ToolbarSeparator" />

        <Toolbar.Link className="ToolbarLink" style={{ marginRight: 10 }}>
          Edited 2 hours ago
        </Toolbar.Link>

        <Toolbar.Separator className="ToolbarSeparator" />

        <div className="zoomImage zoomout" />
        <SliderDemo styles={{pointerEvents:'auto'}}/>
        <div  className="zoomImage zoomin" />

        <Toolbar.Separator className="ToolbarSeparator" />

        <PopoverDemo />

      </Toolbar.Root>
    </div>
  );
});

export default ToolbarDemo;

const PopoverDemo: FC = () => {
  const [vlans, setVlans] = useState<string[]>([]);
  const [newVlan, setNewVlan] = useState<string>('');

  const handleAddVlan = () => {
    if (newVlan.trim() !== '') {
      setVlans((prevVlans) => {
        const updatedVlans = [...prevVlans, newVlan];
        EventBus.emit('updateVlans', updatedVlans);
        EventBus.emit('showAlert', 'vlan added successfully!');
        setTimeout(() => {
          EventBus.emit('hideAlert');
        }, 3000);
        return updatedVlans;
      });
      setNewVlan('');
    }
  };

  const handleDeleteVlan = (index: number) => {
    setVlans((prevVlans) => {
      const updatedVlans = prevVlans.filter((_, i) => i !== index);

      EventBus.emit('showAlert', 'vlan deleted successfully!');
      setTimeout(() => {
        EventBus.emit('hideAlert');
      }, 3000);
      
      return updatedVlans;
    });
  };
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="ToolbarButton" aria-label="Update dimensions">
          Agregar Vlan
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="PopoverContent" >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className="Text" style={{ marginBottom: 10 }}>
              Vlans
            </p>
            <fieldset className="Fieldset">
              <input
                className="Input"
                id="width"
                placeholder='Escribe aquí'
                value={newVlan}
                onChange={(e) => setNewVlan(e.target.value)}
              />
              <button className='ToolbarButton' onClick={handleAddVlan}>Agregar</button>
            </fieldset>
          </div>

          <ScrollAreaDemo vlans={vlans} onDeleteVlan={handleDeleteVlan} />

          <Popover.Close className="PopoverClose" aria-label="Close">
          </Popover.Close>
          <Popover.Arrow className="PopoverArrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

interface ScrollAreaDemoProps {
  vlans: string[];
  onDeleteVlan: (index: number) => void;
}

const ScrollAreaDemo: FC<ScrollAreaDemoProps> = ({ vlans, onDeleteVlan }) => (
  <ScrollArea.Root className="ScrollAreaRootToolbar">
    <ScrollArea.Viewport className="ScrollAreaViewport">
      {vlans.map((vlan, index) => (
        <div key={index} className="VlanItem">
          vlan {vlan}
          <button className='ToolbarButton' onClick={() => onDeleteVlan(index)}>Delete</button>
        </div>
      ))}
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
      <ScrollArea.Thumb className="ScrollAreaThumb" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
      <ScrollArea.Thumb className="ScrollAreaThumb" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner className="ScrollAreaCorner" />
  </ScrollArea.Root>
);


