import React, { FC, useState, forwardRef, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './styles.css';
import { EventBus } from '@/canvas/EventBus';
import { Pc, Router } from '@/canvas/components/netComponents';
import * as ScrollArea from '@radix-ui/react-scroll-area';

interface SwitchPropertiesProps {
  style?: React.CSSProperties;
}

const SwitchProperties: FC<SwitchPropertiesProps> = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);
  const [currentInterface, setCurrentInterface] = useState<number | null>(null);
  const [switchProps, setSwitchProps] = useState<{
    ports: { object: Pc | Router | null; vlan: string; speed: string; duplex: string; description: string; status: string; mode: string }[];
    identifier: string;
    message: string;
    hostname: string;
  }>({
    ports: Array.from({ length: 24 }).map(() => ({
      object: null,
      vlan: '',
      speed: '',
      duplex: '',
      description: '',
      status: '',
      mode: '',
    })),
    identifier: '',
    message: '',
    hostname: '',
  });

  const [vlans, setVlans] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>('');

  const formRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const showDialog = () => {
      setOpen(true);
      setCurrentInterface(0); // Set the current interface to the first one when opening the dialog
    };

    EventBus.on('showSwitchProperties', (data: { ports: { object: Pc | Router | null; vlan: string; speed: string; duplex: string; description: string; status: string; mode: string }[]; identifier: number, 
    message: string, hostname: string}) => {
      setSwitchProps({
        ports: data.ports,
        identifier: data.identifier.toString(),
        message: data.message,
        hostname: data.hostname,
      });
      setSelectedMode(data.ports[0]?.mode || '');
      showDialog();
    });

    //receive vlans on canvas (scenes)
    EventBus.on('vlans', (vlans: string[]) => {
      setVlans(vlans);
    });

  }, []);

  const handleInputChange = (index: number, field: string, value: string) => {
    const newPorts = [...switchProps.ports];
    newPorts[index] = { ...newPorts[index], [field]: value };
    setSwitchProps({ ...switchProps, ports: newPorts });
  };

  const handleModeChange = (index: number, mode: string) => {
    const newPorts = [...switchProps.ports];
    newPorts[index] = { ...newPorts[index], mode };
    if (mode === 'access') {
      newPorts[index].vlan = ''; // Clear VLAN when switching to access mode
    }
    setSwitchProps({ ...switchProps, ports: newPorts });
  };

  const renderInterfaceForm = (index: number) => {
    const port = switchProps.ports[index];

    return (
      <div ref={formRef} key={index} className="PortForm">
        <h3>Interface {index + 1} Properties</h3>
        <label id='label'>
          Mode:
          <select value={port.mode} onChange={(e) => handleModeChange(index, e.target.value)}>
            <option value="">Select Mode</option>
            <option value="access">Access</option>
            <option value="trunk">Trunk</option>
          </select>
        </label >
        {port.mode === 'access' && (
        <label id='label' >
            VLAN:
            <select value={port.vlan} onChange={(e) => handleInputChange(index, 'vlan', e.target.value)}>
              <option value="">Select VLAN</option>
              {vlans.map((vlan, idx) => (
                <option key={idx} value={vlan}>
                  {vlan}
                </option>
              ))}
            </select>
          </label>
        )}
        <label id='label'>
          Speed:
          <select value={port.speed} onChange={(e) => handleInputChange(index, 'speed', e.target.value)}>
            <option value="">Select Speed</option>
            <option value="auto">Auto</option>
            <option value="10">10</option>
            <option value="100">100</option>
          </select>
        </label>
        <label id='label'>
          Duplex:
          <select value={port.duplex} onChange={(e) => handleInputChange(index, 'duplex', e.target.value)}>
            <option value="">Select Duplex</option>
            <option value="auto">Auto</option>
            <option value="half">Half</option>
            <option value="full">Full</option>
          </select>
        </label>
        <label id='label'>
          Description:
          <input id='description' type="text" value={port.description} onChange={(e) => handleInputChange(index, 'description', e.target.value)} />
        </label>
        <label id='label'>
          Status:
          <select value={port.status} onChange={(e) => handleInputChange(index, 'status', e.target.value)}>
            <option value="">Select Status</option>
            <option value="auto">On</option>
            <option value="half">Off</option>
          </select>
        </label>
      </div>
    );
  };

  const saveChanges = () => {
    EventBus.emit('saveSwitchData', switchProps);
    console.log(switchProps);
    setOpen(false); // Close the dialog after saving

    EventBus.emit('showAlert', 'Changes saved successfully!');
    setTimeout(() => {
      EventBus.emit('hideAlert');
    }, 3000);
  };

  return (
    <div id='switchProp' style={{ position: 'absolute', pointerEvents: 'auto' }}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">SWITCH {switchProps.identifier} PROPERTIES</Dialog.Title>
            <Dialog.Description className="DialogDescription">
            Select an interface to edit its properties..
            </Dialog.Description>

            <div className='mb-2 text-xs color text-black	flex'>
              <div className='content-center mr-2'>
                hostname
              </div>
              <input id='hostname' type="text" placeholder={switchProps.hostname} onChange={(e) => switchProps.hostname = e.target.value}/>
            </div>

            <div className='mb-2 text-xs color text-black	flex'>
              <div className='content-center mr-3'>
                message 
              </div>
              <input id='message' type="text" placeholder={switchProps.message} onChange={(e) => switchProps.message = e.target.value}/>
            </div>

            <div className='flex'>
              <div ref={scrollAreaRef}>
                <ScrollAreaDemo setCurrentInterface={setCurrentInterface} />
              </div>

              <div ref={formRef}>
                {currentInterface !== null && renderInterfaceForm(currentInterface)}
              </div>
            </div>

            <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
              <Dialog.Close asChild>
                <button className="Button green" onClick={saveChanges}>Save changes</button>
              </Dialog.Close>
            </div>

            <Dialog.Close asChild>
              <button className="IconButton" aria-label="Close">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
});

export default SwitchProperties;

interface ScrollAreaDemoProps {
  setCurrentInterface: (index: number) => void;
}

const ScrollAreaDemo: FC<ScrollAreaDemoProps> = ({ setCurrentInterface }) => (
  <ScrollArea.Root className="ScrollAreaRoot">
    <ScrollArea.Viewport className="ScrollAreaViewport">
      <div style={{display: 'flex'}}>
        {Array.from({ length: 24 }).map((_, index) => (
          <button
            key={index}
            className="InterfaceButton"
            onClick={() => setCurrentInterface(index)}
          >
            Interface {index + 1}
          </button>
        ))}
      </div>
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
