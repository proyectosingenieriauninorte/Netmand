'use client'
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

const RouterSettings: FC<RouterProps> = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);
  const [currentInterface, setCurrentInterface] = useState<number | null>(0);
  const [routerProps, setRouterProps] = useState<{
    ports: { object: Switch | Router | null; speed: string; duplex: string; description: string; status: string; net: string; interface_ip: string; interface_mask: string; dot1q: { vlan: string; ip: string; mask: string }[] }[];
    identifier: string;
    message: string;
    hostname: string;
    rip: string[];
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
    rip: [],
  });

  const [ripInput, setRipInput] = useState<string>('');
  const [vlans, setVlans] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const showDialog = () => {
      setOpen(true);
      setCurrentInterface(0); // Set the current interface to the first one when opening the dialog
    };

    EventBus.on('showRouterProperties', (data: { ports: { object: Switch | Router | null; speed: string; duplex: string; description: string; status: string; net: string; interface_ip: string; interface_mask: string; dot1q: { vlan: string; ip: string; mask: string }[] }[], identifier: number; message: string; hostname: string; rip: string[];}) => {
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

  const handleRipInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRipInput(e.target.value);
  };

  const handleRipSubmit = () => {
    if (ripInput.trim() && !routerProps.rip.includes(ripInput.trim())) {
      setRouterProps({ ...routerProps, rip: [...routerProps.rip, ripInput.trim()] });
      setRipInput('');
    }
  };

  const handleRipDelete = (index: number) => {
    const newRip = [...routerProps.rip];
    newRip.splice(index, 1);
    setRouterProps({ ...routerProps, rip: newRip });
  };

  const validateForm = () => {
    for (const port of routerProps.ports) {
      for (const dot1q of port.dot1q) {
        if (!dot1q.vlan || !dot1q.ip || !dot1q.mask) {
          setValidationMessage('Please fill all Dot1Q Fields before saving. Otherwise, remove the DOT1Q interfaces');
          return false;
        }
      }
    }
    setValidationMessage(null);
    return true;
  };

  const saveChanges = () => {
    if (validateForm()) {
      EventBus.emit('saveRouterData', routerProps);
      console.log(routerProps);
      setOpen(false); // Close the dialog after saving

      EventBus.emit('showAlert', 'Changes saved successfully!');
      setTimeout(() => {
        EventBus.emit('hideAlert');
      }, 3000);
    }
  };

  const renderInterfaceForm = (portIndex: number) => {
    const port = routerProps.ports[portIndex];
    const dot1qInterfaces = port.dot1q;

    const handleAddDot1q = () => {
      if (dot1qInterfaces.every(d => d.vlan && d.ip && d.mask)) {
        addDot1qInterface(portIndex);
      } else {
        setValidationMessage('Please fill all fields before adding a new DOT1Q interface.');
      }
    };

    return (
      <div ref={formRef} key={portIndex} className="PortForm">
        <label className='FormRow'>
          <span className='Label'>Ip</span>
          <input className='Input' type="text" value={port.interface_ip} onChange={(e) => handleInputChange(portIndex, 'interface_ip', e.target.value)} />
        </label>
        <label className='FormRow'>
          <span className='Label'>Mask</span>
          <input className='Input' type="text" value={port.interface_mask} onChange={(e) => handleInputChange(portIndex, 'interface_mask', e.target.value)} />
        </label>
        <label className='FormRow'>
          <span className='Label'>Description</span>
          <input className='Input' type="text" value={port.description} onChange={(e) => handleInputChange(portIndex, 'description', e.target.value)} />
        </label>
        <label className='FormRow'>
          <span className='Label'>Speed</span>
          <select className='Select' value={port.speed} onChange={(e) => handleInputChange(portIndex, 'speed', e.target.value)}>
            <option value="">Select Speed</option>
            <option value="auto">Auto</option>
            <option value="10">10</option>
            <option value="100">100</option>
          </select>
        </label>
        <label className='FormRow'>
          <span className='Label'>Duplex</span>
          <select className='Select' value={port.duplex} onChange={(e) => handleInputChange(portIndex, 'duplex', e.target.value)}>
            <option value="">Select Duplex</option>
            <option value="auto">Auto</option>
            <option value="half">Half</option>
            <option value="full">Full</option>
          </select>
        </label>
        <label className='FormRow'>
          <span className='Label'>Status</span>
          <select className='Select' value={port.status} onChange={(e) => handleInputChange(portIndex, 'status', e.target.value)}>
            <option value="">Select Status</option>
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </label>
        <hr className="Separator" />
        <div className="Dot1qContainer">
          {dot1qInterfaces.map((dot1q, dot1qIndex) => (
            <div key={dot1qIndex} className="Dot1qInterface">
              <label className='FormRow'>
                <span className='Label'>VLAN</span>
                <select className='Select' value={dot1q.vlan} onChange={(e) => handleDot1qChange(portIndex, dot1qIndex, 'vlan', e.target.value)}>
                  <option value="">Select VLAN</option>
                  {vlans.map(vlan => (
                    <option key={vlan} value={vlan}>{vlan}</option>
                  ))}
                </select>
              </label>
              <label className='FormRow'>
                <span className='Label'>IP</span>
                <input className='Input' type="text" value={dot1q.ip} onChange={(e) => handleDot1qChange(portIndex, dot1qIndex, 'ip', e.target.value)} />
              </label>
              <label className='FormRow'>
                <span className='Label'>Mask</span>
                <input className='Input' type="text" value={dot1q.mask} onChange={(e) => handleDot1qChange(portIndex, dot1qIndex, 'mask', e.target.value)} />
              </label>
              <button type="button" className="Button red" onClick={() => removeDot1qInterface(portIndex, dot1qIndex)}>Remove</button>
              <hr className="Separator" />
            </div>
          ))}
          <button type="button" className="Button blue" onClick={handleAddDot1q}>Add DOT1Q Interface</button>
        </div>
      </div>
    );
  };

  return (
    <div id='routerProp' style={{ position: 'absolute', pointerEvents: 'auto' }}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">ROUTER {routerProps.identifier} PROPERTIES</Dialog.Title>
            <Dialog.Description>
            </Dialog.Description>

            <div className='mb-2 text-xs color text-black flex'>
              <div className='content-center mr-2'>
                hostname
              </div>
              <input id='hostname' type="text" placeholder={routerProps.hostname} onChange={(e) => setRouterProps({ ...routerProps, hostname: e.target.value })} />
            </div>

            <div className='mb-2 text-xs color text-black flex'>
              <div className='content-center mr-3'>
                message
              </div>
              <input id='message' type="text" placeholder={routerProps.message} onChange={(e) => setRouterProps({ ...routerProps, message: e.target.value })} />
            </div>

            <div className='mb-2 text-xs color text-black flex'>
              <div className='content-center mr-3'>
                  Rip Prot.
              </div>
              <input id='rip' type="text" value={ripInput} onChange={handleRipInputChange} />
              <button type="button" className="submitBtton" onClick={handleRipSubmit}>Submit</button>
            </div>

            <div className='RipIpList'>
              {routerProps.rip.map((ripIp, index) => (
                <div key={index} className="RipIpContainer">
                <span>{ripIp}</span>
                <button
                  type="button"
                  className="Button red"
                  onClick={() => handleRipDelete(index)}
                >
                  Delete
                </button>
              </div>
              ))}
            </div>

            <div className='interfaceTittle'>
              <h3>Interface {currentInterface !== null ? currentInterface + 1 : ''} </h3>
            </div>

            <div className='RouterSettings'>
              <div className='interfacesRouter'>
                {Array.from({ length: 4 }).map((_, index) => (
                  <button
                    key={index}
                    className={`InterfaceButton ${currentInterface === index ? 'selected' : ''}`}
                    onClick={() => setCurrentInterface(index)}
                  >
                    Interface {index + 1}
                  </button>
                ))}
              </div>

              <div className="ScrollContainer">
                {currentInterface !== null && renderInterfaceForm(currentInterface)}
              </div>
            </div>

            {validationMessage && (
              <div className="ValidationMessage">
                {validationMessage}
              </div>
            )}

            <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
              <button className="Button green" onClick={saveChanges}>Save changes</button>
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

export default RouterSettings;
