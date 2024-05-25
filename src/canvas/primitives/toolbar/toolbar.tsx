import React from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import {
  StrikethroughIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  FontBoldIcon,
  FontItalicIcon,
} from '@radix-ui/react-icons';
import './styles.css';
import { FC, useState, forwardRef, useEffect} from 'react';
import { EventBus } from '@/canvas/EventBus';
import SliderDemo from '../slider/slider';

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

        <Toolbar.Button className="ToolbarButton" onClick={showCommands}>
          Mostrar Commandos
        </Toolbar.Button>
        
      </Toolbar.Root>
    </div>
  );
});

export default ToolbarDemo;