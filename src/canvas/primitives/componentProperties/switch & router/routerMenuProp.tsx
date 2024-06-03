import React, { FC, useState, forwardRef, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './styles.css';
import { EventBus } from '@/canvas/EventBus';
import { Switch, Router } from '@/canvas/components/netComponents';
import * as ScrollArea from '@radix-ui/react-scroll-area';

interface RouterProps {
  style?: React.CSSProperties;
}

const RouterProperties: FC<RouterProps> = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);
  const [currentInterface, setCurrentInterface] = useState<number | null>(null);
  const [routerProps, setRouterProps] = useState<{
    ports: { object: Switch | Router | null; speed: string; duplex: string; description: string; status: string; net: string; interface_ip: string; interface_mask: string; dot1q: { vlan: string; ip: string; mask: string }[] }[];
    identifier: string;
    message: string;
    hostname: string;
    rip: string;
  }>({
    ports: Array.from({ length: 24 }).map(() => ({
      object: null,
      speed: '',
      duplex: '',
      description: '',
      status: '',
      net: '',
      interface_ip: '',
      interface_mask: '',
      dot1q: [{ vlan: '', ip: '', mask: '' }],
    })),
    identifier: '',
    message: '',
    hostname: '',
    rip: '',
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

    EventBus.on('showRouterProperties', (data: { ports: { object: Switch | Router | null; speed: string; duplex: string; description: string; status: string; net: string; interface_ip: string; interface_mask: string; dot1q: { vlan: string; ip: string; mask: string }[] }[], identifier: number; message: string; hostname: string; rip: string;}) => {
      setRouterProps({
        ports: data.ports,
        identifier: data.identifier.toString(),
        message: data.message,
        hostname: data.hostname,
        rip: data.rip,
      });
      setSelectedMode(data.ports[0]?.status || '');
      showDialog();
    });

    // Receive vlans on canvas (scenes)
    EventBus.on('vlans', (vlans: string[]) => {
      setVlans(vlans);
    });

  }, []);

  const handleInputChange = (index: number, field: string, value: string) => {
    const newPorts = [...routerProps.ports];
    newPorts[index] = { ...newPorts[index], [field]: value };
    setRouterProps({ ...routerProps, ports: newPorts });
  };

  const handleDot1qChange = (portIndex: number, dot1qIndex: number, field: string, value: string) => {
    const newPorts = [...routerProps.ports];
    const newDot1q = [...newPorts[portIndex].dot1q];
    newDot1q[dot1qIndex] = { ...newDot1q[dot1qIndex], [field]: value };
    newPorts[portIndex] = { ...newPorts[portIndex], dot1q: newDot1q };
    setRouterProps({ ...routerProps, ports: newPorts });

    console.log(routerProps);
  };

  const addDot1qInterface = (index: number) => {
    const newPorts = [...routerProps.ports];
    newPorts[index].dot1q.push({ vlan: '', ip: '', mask: '' });
    setRouterProps({ ...routerProps, ports: newPorts });
  };

  const removeDot1qInterface = (portIndex: number, dot1qIndex: number) => {
    const newPorts = [...routerProps.ports];
    newPorts[portIndex].dot1q.splice(dot1qIndex, 1);
    setRouterProps({ ...routerProps, ports: newPorts });
  };

  const renderDot1qInterfaces = (portIndex: number) => {
    const dot1qInterfaces = routerProps.ports[portIndex].dot1q;

    return (
      <ScrollArea.Root className="ScrollAreaDotRoot">
        <ScrollArea.Viewport className="ScrollAreaViewport">
          <div>
            {dot1qInterfaces.map((dot1q, index) => (
              <div key={index} className="Dot1qForm">
                <h4>Dot1q Interface {index + 1}</h4>
                <label id='label'>
                  VLAN:
                  <select value={dot1q.vlan} onChange={(e) => handleDot1qChange(portIndex, index, 'vlan', e.target.value)}>
                    <option value="">Select VLAN</option>
                    {vlans.map((vlan, idx) => (
                      <option key={idx} value={vlan}>
                        {vlan}
                      </option>
                    ))}
                  </select>
                </label>
                <label id='label'>
                  IP:
                  <input id='dotinput' type="text" value={dot1q.ip} onChange={(e) => handleDot1qChange(portIndex, index, 'ip', e.target.value)} />
                </label>
                <label id='label'>
                  Mask:
                  <input id='dotinput' type="text" value={dot1q.mask} onChange={(e) => handleDot1qChange(portIndex, index, 'mask', e.target.value)} />
                </label>
                <button onClick={() => removeDot1qInterface(portIndex, index)}>Remove Dot1q</button>
              </div>
            ))}
            <button id='addDot1q' onClick={() => addDot1qInterface(portIndex)}>Add Dot1q</button>
            
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
  };

  const renderInterfaceForm = (index: number) => {
    const port = routerProps.ports[index];

    return (
      <div ref={formRef} key={index} className="PortForm overflow-y-auto">
        <h3>Interface {index + 1} Properties</h3>
        <label id='label'>
          Dirección Ip:
          <input id='description' type="text" value={port.interface_ip} onChange={(e) => handleInputChange(index, 'interface_ip', e.target.value)} />
        </label>
        <label id='label'>
          Máscara:
          <input id='description' type="text" value={port.interface_mask} onChange={(e) => handleInputChange(index, 'interface_mask', e.target.value)} />
        </label>
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
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </label>
        <label id='label'>
          Net:
          <select value={port.net} onChange={(e) => handleInputChange(index, 'net', e.target.value)}>
            <option value="">Select Net</option>
            <option value="net1">Net1</option>
            <option value="net2">Net2</option>
          </select>
        </label>
        <h4>Dot1q Interfaces</h4>
        {renderDot1qInterfaces(index)}
      </div>
    );
  };

  const saveChanges = () => {
    EventBus.emit('saveRouterData', routerProps);
    console.log(routerProps);
    setOpen(false); // Close the dialog after saving

    EventBus.emit('showAlert', 'Changes saved successfully!');
    setTimeout(() => {
      EventBus.emit('hideAlert');
    }, 3000);
  };

  return (
    <div id='routerProp' style={{ position: 'absolute', pointerEvents: 'auto' }}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogRouterContent">
            <Dialog.Title className="DialogTitle">ROUTER {routerProps.identifier} PROPERTIES</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Select an interface to edit its properties.
            </Dialog.Description>

            <div className='mb-2 text-xs color text-black flex'>
              <div className='content-center mr-2'>
                hostname
              </div>
              <input id='hostname' type="text" placeholder={routerProps.hostname} onChange={(e) => setRouterProps({ ...routerProps, hostname: e.target.value })} />
            </div>

            <div className='mb-2 text-xs color text-black flex'>
              <div className='content-center mr-12'>
                rip
              </div>
              <input id='rip' type="text" placeholder={routerProps.rip} onChange={(e) => setRouterProps({ ...routerProps, rip: e.target.value })} />
            </div>

            <div className='mb-2 text-xs color text-black flex'>
              <div className='content-center mr-3'>
                message
              </div>
              <input id='message' type="text" placeholder={routerProps.message} onChange={(e) => setRouterProps({ ...routerProps, message: e.target.value })} />
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

export default RouterProperties;

interface ScrollAreaDemoProps {
  setCurrentInterface: (index: number) => void;
}

const ScrollAreaDemo: FC<ScrollAreaDemoProps> = ({ setCurrentInterface }) => (
  <ScrollArea.Root className="ScrollAreaRoot">
    <ScrollArea.Viewport className="ScrollAreaViewport">
      <div>
        {Array.from({ length: 4 }).map((_, index) => (
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
