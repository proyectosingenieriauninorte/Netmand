import React, { useState, useEffect, FC, forwardRef } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import { EventBus } from '@/canvas/EventBus';
import SliderDemo from '../slider/slider';
import * as Popover from '@radix-ui/react-popover';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import './styles.css';

interface ToolbarDemoProps {
  style?: React.CSSProperties;
}

const pcClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
  EventBus.emit('addPc');
  event.currentTarget.blur();
};

const switchClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
  EventBus.emit('addSwitch');
  event.currentTarget.blur();
};

const routerClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
  EventBus.emit('addRouter');
  event.currentTarget.blur();
};

const cableClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
  EventBus.emit('addCable');
  event.currentTarget.blur();
};

const ToolbarDemo: FC<ToolbarDemoProps> = forwardRef((_, ref) => {
  const [isGridChecked, setIsGridChecked] = useState(true);
  const [isAnimationChecked, setIsAnimationChecked] = useState(true); // Initially checked

  useEffect(() => {
  
    return () => {

    };
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setIsGridChecked(isChecked);
    EventBus.emit('showGrid', isChecked);
    event.currentTarget.blur();
  };

  const handleAnimationCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setIsAnimationChecked(isChecked);
    EventBus.emit('toggleCableAnimations', isChecked); // Emit the updated state value
    event.currentTarget.blur();
  };

  return (
    <div style={{ pointerEvents: 'auto', bottom: '2%', left: '50%', transform: 'translateX(-50%)', position: 'absolute'}}>
      
      <Toolbar.Root id='Toolbar' className="ToolbarRoot" aria-label="Formatting options">
          
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
          Edited at {new Date().toLocaleTimeString()}
        </Toolbar.Link>

        <Toolbar.Separator className="ToolbarSeparator" />

        <div className="zoomImage zoomout" />
        <SliderDemo styles={{pointerEvents:'auto'}}/>
        <div  className="zoomImage zoomin" />

        <Toolbar.Separator className="ToolbarSeparator" />

        <PopoverDemo />

        <Toolbar.Separator className="ToolbarSeparator" />

        <div className="checkbox-wrapper-27">
          <label className="checkbox">
            <input type="checkbox" checked={isGridChecked} onChange={handleCheckboxChange} />
            <span className="checkbox__icon"> Grid</span>
          </label>
        </div>

        <div className="checkbox-wrapper-27">
          <label className="checkbox">
            <input type="checkbox" checked={isAnimationChecked} onChange={handleAnimationCheckboxChange} />
            <span className="checkbox__icon"> Animations</span>
          </label>
        </div>

      </Toolbar.Root>
    </div>
  );
});

export default ToolbarDemo;

const PopoverDemo: FC = () => {
  const [vlans, setVlans] = useState<string[]>([]);
  const [newVlan, setNewVlan] = useState<string>('');

  const handleAddVlan = () => {
    if (/^\d+$/.test(newVlan)) {
      const vlanNumber = parseInt(newVlan, 10);
      if (!isNaN(vlanNumber) && vlanNumber >= 1 && vlanNumber <= 4094) {
        if (!vlans.includes(newVlan)) {
          const updatedVlans = [...vlans, newVlan];
          setVlans(updatedVlans);
          setNewVlan('');

          // Emitir eventos después de actualizar el estado
          EventBus.emit('updateVlans', updatedVlans);
          EventBus.emit('showAlert', 'VLAN added successfully!');
          setTimeout(() => {
            EventBus.emit('hideAlert');
          }, 3000);
        } else {
          EventBus.emit('showAlert', 'VLAN already exists. Please enter a unique VLAN.');
          setTimeout(() => {
            EventBus.emit('hideAlert');
          }, 3000);
        }
      } else {
        EventBus.emit('showAlert', 'Invalid VLAN. Please enter a number between 1 and 4094.');
        setTimeout(() => {
          EventBus.emit('hideAlert');
        }, 3000);
      }
    } else {
      EventBus.emit('showAlert', 'Invalid VLAN. Please enter a number.');
      setTimeout(() => {
        EventBus.emit('hideAlert');
      }, 3000);
    }
  };   

  const handleDeleteVlan = (index: number) => {
    const updatedVlans = vlans.filter((_, i) => i !== index);
    setVlans(updatedVlans);

    // Emitir eventos después de actualizar el estado
    EventBus.emit('updateVlans', updatedVlans);
    EventBus.emit('showAlert', 'vlan deleted successfully!');
    setTimeout(() => {
      EventBus.emit('hideAlert');
    }, 3000);
  };

  useEffect(() => {
    const handler = (updatedVlans: string[]) => {
      setVlans(updatedVlans);
    };
    EventBus.on('updateVlans', handler);

    return () => {
      EventBus.off('updateVlans', handler);
    };
  }, []);

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
